import urllib
import urllib.request
import urllib.parse
import re
import pandas as pd

class get_recipe_url():

    def __init__(self):
        self.last_url_list = []

    def get_url_from_menuphoto_class(self,url):

        with urllib.request.urlopen(url) as response:
            html = response.read().decode('utf-8')
            regex = r'<p class="menuphoto"><a href="(.*?)">'
            pattern = re.compile(regex, re.MULTILINE | re.DOTALL)
            match = pattern.findall(html)
            return match


    def get_url_from_recipeDoc_pic_class(self,url):

        with urllib.request.urlopen(url) as response:
            html = response.read().decode('utf-8')
            regex = r'changeRedirAddMypage\(\'(.*?)\'\)'
            pattern = re.compile(regex, re.MULTILINE | re.DOTALL)
            match = pattern.findall(html)
            newurl_list = []
            for number in match:
                new_url = 'https://park.ajinomoto.co.jp/recipe/card/' + number
                newurl_list.append(new_url)
            return newurl_list


    def get_url_list(self,url):
        url_list = []
        #cardをurlに含んでいれば最終url
        regex = r'card'
        pattern = re.compile(regex, re.MULTILINE | re.DOTALL)
        contain_card = pattern.findall(url)
        if contain_card == []:
            url_list = self.get_url_from_menuphoto_class(url)
            if url_list == []:
                url_list = self.get_url_from_recipeDoc_pic_class(url)
        else:
             self.last_url_list.append(url)
        return url_list

    def get_all_url_list(self,url):

        url_list = self.get_url_list(url)
        while(url_list != []):
            print(url_list)
            new_url_list = []
            for one_url in url_list:
                new_url_list.extend(self.get_url_list(one_url))
            url_list = new_url_list
        return self.last_url_list

    def save_cav(self, url):
        regex = r'.*/(.*)'
        pattern = re.compile(regex, re.MULTILINE | re.DOTALL)
        name = pattern.findall(url)[0]
        df = pd.DataFrame(self.get_all_url_list(url))
        print(name)
        df.to_csv("../url_csv/" + name + ".csv", index=False, header=False)
get_recipe_url().save_cav("https://park.ajinomoto.co.jp/recipe/corner/fukusai")