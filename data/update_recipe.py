import json
category = 'staple-food'
recipe_file_path = 'recipe_scraping/' + category + '.json'
composition_file_path = 'foodcomposition/composition.json'


protein_name_list = ["たんぱく質"]
protein_standard_list = {"たんぱく質":60}
lipid_name_list = ["脂   質"]
lipid_standard_list = {"脂   質":67}
carbohydrate_name_list = ["炭水化物"]
carbohydrate_standard_list = {"炭水化物":60}
vitamin_name_list = ["ビタミンB1", "ビタミンB2", "ビタミンB6", "ビタミンB12", "ビタミンC", "ナイアシン", "葉酸", "ビタミンK", "ビタミンD"]
vitamin_standard_list = {"ビタミンB1":1.4, "ビタミンB2":1.6, "ビタミンB6":1.4, "ビタミンB12":2.4, "ビタミンC":100, "ナイアシン":15, "葉酸":240, "ビタミンK":150, "ビタミンD":5.5}
mineral_name_list = ["ナトリウム", "カリウム", "カルシウム", "マグネシウム", "リン", "鉄", "亜鉛", "銅"]
mineral_standard_list = {"ナトリウム":8000, "カリウム":2500, "カルシウム":800, "マグネシウム":340, "リン":1000, "鉄":7.0, "亜鉛":10, "銅":0.9}

recipe_dict_list = []
composition_dict = {}

new_recipe_dict_list = []
no_composition_data = []

with open(recipe_file_path, 'r') as recipe_file:
    recipe_dict_list = json.load(recipe_file)
with open(composition_file_path, 'r') as composition_file:
    composition_dict = json.load(composition_file)
def getValueFromList(n_list,n_standard_list, n_dict):
    sum = 0.0
    for n in n_list:
        if n in n_dict.keys():
            sum += n_dict[n] / n_standard_list[n];
    return sum / len(n_list)

def getFoodNutrient(food):
    protein = getValueFromList(protein_name_list, protein_standard_list,composition_dict[food])
    lipid = getValueFromList(lipid_name_list, lipid_standard_list,composition_dict[food])
    carbohydrate = getValueFromList(carbohydrate_name_list,carbohydrate_standard_list, composition_dict[food])
    vitamin = getValueFromList(vitamin_name_list,vitamin_standard_list ,composition_dict[food])
    mineral = getValueFromList(mineral_name_list,mineral_standard_list, composition_dict[food])
    return {"protein" : protein, "lipid" : lipid, "carbohydrate" : carbohydrate, "vitamin" : vitamin, "mineral" : mineral}



#print(recipe_dict_list)
#print(composition_dict)

def calculateData(amount,servings, nut_dict):
    for key in nut_dict:
        nut_dict[key] = (nut_dict[key] * float(amount) / 100.0) / float(servings)
    return nut_dict

def getRecipeNutrientSum(recipe):
    nutrient_dict = {"protein":0, "lipid":0, "carbohydrate":0, "vitamin":0, "mineral":0}
    servings = recipe["servings"]
    for ing in recipe["ingredient"]:
        if ing in composition_dict:
            amount = recipe["ingredient"][ing]
            food_nutrient = getFoodNutrient(ing)
            food_nutrient = calculateData(amount, servings,food_nutrient)
            for key in nutrient_dict:
                nutrient_dict[key] += food_nutrient[key]
        else:
            if not ing in no_composition_data:
                no_composition_data.append(ing)
    return nutrient_dict

def updateRecipe(recipe):
    recipe_new = recipe
    recipe_new.update({'nutrient':getRecipeNutrientSum(recipe_new)})
    recipe_new.update({'category':category})
    return recipe_new 


# main
for recipe in recipe_dict_list:
    new_recipe_dict_list.append(updateRecipe(recipe))

with open('new_' + category + '_data.json', 'w') as w_file:
    json.dump(new_recipe_dict_list, w_file, ensure_ascii=False)
with open('no_composition_data.json', 'w') as w_file2:
    json.dump(no_composition_data, w_file2, ensure_ascii=False)
