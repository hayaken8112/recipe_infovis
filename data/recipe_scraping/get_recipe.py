# -*- coding: utf-8 -*-
import lxml.html
import requests
import re
import csv
import json
from bs4 import BeautifulSoup

categoly = 'staple-food' # main, side, staple-food
sample_url = 'https://park.ajinomoto.co.jp/recipe/card/708765'
#recipe_url_list = ['https://park.ajinomoto.co.jp/recipe/card/706078','https://park.ajinomoto.co.jp/recipe/card/800524?areaid=recipe_card_018']
recipe_url_list = []
ingredientHash = {}

nodataHash = {}
noUnitDataHash = {}
csv_file = open('ingredient_unit.csv')
url_csv_file = open('../url_csv/' + categoly + '.csv')

def setRecipeURL():
    reader = csv.reader(url_csv_file)
    for row in reader:
        recipe_url_list.append(row[0])

def getIngredientUnit():
    reader = csv.reader(csv_file)
    next(reader)
    prev = ''
    unitHash = {}
    for row in reader:
        if row[0] != prev:
            unitHash = {}
            unitHash[row[1]] = row[2]
        else:
            unitHash[row[1]] = row[2]
        ingredientHash[row[0]] = unitHash 
        prev = row[0]


def extractInt(s):
    return int(re.match("\d*", s).group())

def extractFloat(s):
    # グラム表記があるかどうか
    temp = re.search(r"(\d|[.]|[/])+[g]", s)
    if (temp):
        s = temp.group()

    temp = re.search(r"(\d|[.]|[/])+", s)
    if temp:
        ex_num = temp.group()
    else :
        ex_num = ''
    unit_s = s.replace(ex_num, '')
    
    if ex_num != '':
        ex_num = eval(ex_num)
    return [ex_num, unit_s]

def getRecipeInfo(url):
    resp = requests.get(url)
    resp.encoding = resp.apparent_encoding
    soup = BeautifulSoup(resp.text,"lxml")
    recipecard = soup.find(class_='recipeCardWrap')
    foodstuff = recipecard.find_all(itemprop="ingredient")

    ingredient = {}
    for food in foodstuff:
        name = food.find('span', itemprop='name').get_text()
        amount_text = food.find('span', class_='numeric').get_text()
        amount = extractFloat(amount_text)
        if (amount[1] == 'g'):
            if name in ingredientHash:
                ingredient[name] = amount[0]
            else:
                nodataHash[name] = amount_text
        else:
            if name in ingredientHash: 
                if amount[1] in ingredientHash[name]:
                    ingredient[name] = amount[0] * int(ingredientHash[name][amount[1]])
                else :
                    noUnitDataHash[name] = amount[1]
            else:
                nodataHash[name] = amount_text



    recipe_name = recipecard.find('h1', class_='recipeCardHl').get_text()
    cooktime = recipecard.find('time', itemprop="cookTime").find('span').get_text()
    calory = recipecard.find('dd', itemprop='calories').get_text()
    salt = recipecard.find(class_='recipeCardSalt').find('span').get_text()
    vegetable = recipecard.find(class_='recipeCardVege').find('span').get_text()
    good = recipecard.find(class_='recipeCardTalkGood').get_text()
    image_url = recipecard.find('img', itemprop='photo').get('src')
    servings_tab = recipecard.find('span', itemprop='yield')
    if (servings_tab != None):
        servings = int(servings_tab.get_text()[0])
    else :
        servings = 1


    recipe_info = {}
    recipe_info['name'] = recipe_name[:-4]
    recipe_info['cooktime'] = int(cooktime)
    recipe_info['calory'] = extractInt(calory)
    recipe_info['salt'] = extractFloat(salt)[0]
    recipe_info['vegetable'] = extractInt(vegetable) 
    recipe_info['ingredient'] = ingredient
    recipe_info['good'] = extractInt(good)
    recipe_info['img'] = image_url
    recipe_info['url'] = url
    recipe_info['servings'] = servings
    return recipe_info

def main():
    setRecipeURL()
    getIngredientUnit()

    recipe_info_list = []
    for rcpurl in recipe_url_list:
        recipe_info_list.append(getRecipeInfo(rcpurl))

    w_file = open(categoly + '.json', 'w')
    json.dump(recipe_info_list, w_file, ensure_ascii=False)
    w_file2 = open('nodata.json', 'w')
    json.dump(nodataHash, w_file2, ensure_ascii=False)
    w_file3 = open('nounit.json', 'w')
    json.dump(noUnitDataHash, w_file3, ensure_ascii=False)

if __name__ == '__main__':
    main()

