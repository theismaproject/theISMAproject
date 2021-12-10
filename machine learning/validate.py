# -*- coding: utf-8 -*-

# Commented out IPython magic to ensure Python compatibility.
# # install needed libraries
# %%bash
# pip install -q transformers
# pip install sentencepiece # needed more bigger models (deberta)

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
from pathlib import Path 

import os

import torch
import torch.optim as optim

import random 

# fastai
from fastai import *
from fastai.text import *
from fastai.callbacks import *
import fastai

# transformers
import transformers
from transformers import PreTrainedModel, PreTrainedTokenizer, PretrainedConfig
from transformers import RobertaForSequenceClassification, RobertaTokenizer, RobertaConfig

class CustomTransformerModel(nn.Module):
    def __init__(self, transformer_model: PreTrainedModel):
        super(CustomTransformerModel,self).__init__()
        self.transformer = transformer_model
        
    def forward(self, input_ids, attention_mask=None):
        
        # attention_mask
        # Mask to avoid performing attention on padding token indices.
        # Mask values selected in ``[0, 1]``:
        # ``1`` for tokens that are NOT MASKED, ``0`` for MASKED tokens.
        attention_mask = (input_ids!=pad_idx).type(input_ids.type()) 
        
        logits = self.transformer(input_ids,
                                  attention_mask = attention_mask)[0]   
        return logits


class TransformersVocab(Vocab):
    def __init__(self, tokenizer: PreTrainedTokenizer):
        super(TransformersVocab, self).__init__(itos = [])
        self.tokenizer = tokenizer
    
    def numericalize(self, t:Collection[str]) -> List[int]:
        "Convert a list of tokens `t` to their ids."
        return self.tokenizer.convert_tokens_to_ids(t)
        #return self.tokenizer.encode(t)

    def textify(self, nums:Collection[int], sep=' ') -> List[str]:
        "Convert a list of `nums` to their tokens."
        nums = np.array(nums).tolist()
        return sep.join(self.tokenizer.convert_ids_to_tokens(nums)) if sep is not None else self.tokenizer.convert_ids_to_tokens(nums)
    
    def __getstate__(self):
        return {'itos':self.itos, 'tokenizer':self.tokenizer}

    def __setstate__(self, state:dict):
        self.itos = state['itos']
        self.tokenizer = state['tokenizer']
        self.stoi = collections.defaultdict(int,{v:k for k,v in enumerate(self.itos)})

class TransformersBaseTokenizer(BaseTokenizer):
    """Wrapper around PreTrainedTokenizer to be compatible with fast.ai"""
    def __init__(self, pretrained_tokenizer: PreTrainedTokenizer, model_type = 'bert', **kwargs):
        self._pretrained_tokenizer = pretrained_tokenizer
        self.max_seq_len = 128
        self.model_type = model_type

    def __call__(self, *args, **kwargs): 
        return self

    def tokenizer(self, t:str) -> List[str]:
        """Limits the maximum sequence length and add the spesial tokens"""
        CLS = self._pretrained_tokenizer.cls_token
        SEP = self._pretrained_tokenizer.sep_token
        if self.model_type in ['roberta']:
            tokens = self._pretrained_tokenizer.tokenize(t, add_prefix_space=True)[:self.max_seq_len - 2]
            tokens = [CLS] + tokens + [SEP]
        else:
            tokens = self._pretrained_tokenizer.tokenize(t)[:self.max_seq_len - 2]
            if self.model_type in ['xlnet']:
                tokens = tokens + [SEP] +  [CLS]
            else:
                tokens = [CLS] + tokens + [SEP]
        return tokens

transformer_tokenizer = RobertaTokenizer.from_pretrained("roberta-large")
transformer_base_tokenizer = TransformersBaseTokenizer(pretrained_tokenizer = transformer_tokenizer, model_type = model_type)
fastai_tokenizer = Tokenizer(tok_func = transformer_base_tokenizer, pre_rules=[], post_rules=[])

pad_first = bool(model_type in ['xlnet'])
pad_idx = transformer_tokenizer.pad_token_id

model_1 = load_learner("/content", file = "model_r1_0.39_20_29_valid.pkl")
model_2 = load_learner("/content", file = "model_r1_0.31_20_29_valid.pkl")
model_3 = load_learner("/content", file = "model_r1_0.358_20_20_test.pkl")

def map_to_values(iv):
  ivz = iv[1].item()
  ivs = iv[2].numpy()
  v = ["Neutral", "Cultural/Religious", "Terror"]
  return [v[ivz], ivs[ivz]*100]

def b_predict(string):
  print("Model 1: {} ({:.1f}% Confident)".format(*map_to_values(model_1.predict(string))))
  print("Model 2: {} ({:.1f}% Confident)".format(*map_to_values(model_2.predict(string))))
  print("Model 3: {} ({:.1f}% Confident)".format(*map_to_values(model_3.predict(string))))

while True:
  b = input()
  b_predict(b)
  print("\n")

"""## Random thoughts....
Train a classifier based on output of three classifiers above???
"""

# maybe ensemble the model(s)?
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
data = pd.read_csv('t.csv')

l = []
for _, i in data.iterrows():
  l.append(list(model_1.predict(i["Text"])[2].numpy()) + list(model_2.predict(i["Text"])[2].numpy()) + list(model_3.predict(i["Text"])[2].numpy()) + [i["Label"]])

l

muslim_tweets_df = pd.DataFrame(l, columns=['f11','f12','f13','f21','f22','f23', 'f31','f32','f33', 'Label'])

muslim_tweets_df.head()

X = muslim_tweets_df.iloc[:,:-1].values
Y = muslim_tweets_df["Label"]

Y

logreg_clf = LogisticRegression()
logreg_clf.fit(X, Y)

text = 'Yeah... did Omar really commit immigration fraud when she married her brother? Were the "some people did something " muslim terrorists? Wouldn\'t you think an American citizen and elected official would condemn a terrorist attack on American citizens and on American soil?'
text = "Collaborated to blow up the World Trade Center.  That is something YOU need to publicly apologize for, instead of demanding a Lady who has been severely traumatized apologize because she wasnt respectful to the Tribe that blames Arabs and Muslims for 9/11, not Larry Silverstein"
text = "Why such behaviour is notbpunishable at community level. What more stupidity is enough for muslims to oppose among themselves? Why not a common member of this community ever expresses his/her anguish publically against these practices? Is this religion is only a mob function?"
text = 'the thing you\'re calling a "joke" included the phrase "jihad squad," how in the world is that "not about Muslims?"'
text = "Well, Islam's own books says Mo is the \"perfect example of a man\".. anyone can take a look at his life and understand why their is concern. But most also recognize that Muslims are individuals and may have their own interpretation.Meanwhile..being white is a race,not a religion."
text = "Calling all Muslims terrorists is so 20 years ago! Get with the times babe! MAGA is the new terrorist."
# text = "I agree, except the police were not Muslim, the camera man bystander though. The police were following protocol and being respectful, but when found the guy has done nothing wrong, then initial stop made by the woman is racially motivated and they should make her apologize."
print("Ensemble: %s " % map_to_values([0, clf.predict(np.reshape(list(model_1.predict(text)[2].numpy()) + list(model_2.predict(text)[2].numpy()) + list(model_3.predict(text)[2].numpy()), (1, -1))), tensor(0,0,0)])[0])
b_predict(text)

while True:
  text = input()
  print("Ensemble: %s " % map_to_values([0, logreg_clf.predict(np.reshape(list(model_1.predict(text)[2].numpy()) + list(model_2.predict(text)[2].numpy()) + list(model_3.predict(text)[2].numpy()), (1, -1))), tensor(0,0,0)])[0])
  b_predict(text)
  print()

logreg_clf.coef_[0]

import json

import pickle

# save
with open('model.pkl','wb') as f:
    pickle.dump(logreg_clf,f)

with open('model.pkl','rb') as f:
    clf = pickle.load(f)

m1 = list(model_1.predict("b")[2].numpy())
m2 = list(model_2.predict("b")[2].numpy())
m3 = list(model_3.predict("b")[2].numpy())
e = clf.predict(np.reshape(m1 + m2 + m3, (1, -1)))
result = {"m1":m1, "m2":m2, "m3":m3, "e": str(e[0])}

result

json.dumps(result)

