import csv
import json

csv_list = []
csv_list.append('food_composition_table_beanproducts.csv')
csv_list.append('food_composition_table_grains.csv')
csv_list.append('food_composition_table_meats.csv')
csv_list.append('food_composition_table_mushrooms.csv')
csv_list.append('food_composition_table_potatoes.csv')
csv_list.append('food_composition_table_seafood.csv')
csv_list.append('food_composition_table_vegetable.csv')


# return food dictionary
# {"food_name" : {composition1 : value, composition2 : value, ...}}
def getCompositionDict(file_name):
    with open(file_name) as bean_csv:
        composition = []
        refined_data = []
        reader = csv.reader(bean_csv)
        data = [row for row in reader]
        composition = data.pop(1)
        refined_data = data[3:]

        comp_dict = {}
        for d in refined_data:
            each_dict = dict(zip(composition[5:-2], d[5:-2]))

            # convert value from string to number
            for key in each_dict:
                if (each_dict[key] == '-') or (each_dict[key] == '(Tr)') or (each_dict[key] == 'Tr'):
                    each_dict[key] = 0
                else:
                    each_dict[key] = eval(each_dict[key])

            comp_dict[d[3]] = each_dict
                
        return comp_dict

compositionDictAll= {}
for csvfile in csv_list:
    compositionDictAll.update(getCompositionDict(csvfile))

#print(compositionDictAll)

with open('composition.json', 'w') as w_file:
    json.dump(compositionDictAll, w_file, ensure_ascii=False)
