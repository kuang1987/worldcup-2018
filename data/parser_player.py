#!/usr/bin/env python

from lxml import etree
import re
import json

def get_html_content(path):
    with open(path, 'r') as f:
        content = f.read()

    return content


if __name__ == '__main__':
    html_content = get_html_content('Players.htm')

    html = etree.HTML(html_content)

    plays_dic = {}

    all_h2 = html.xpath('/html/body/h2')

    all_group = []
    for h2 in all_h2:
        all_group.append(h2.xpath('span')[0].text[-1])

    #print all_group

    teams = []
    all_h3 = html.xpath('/html/body/h3')
    all_team_name = []
    for h3 in all_h3:
        all_team_name.append(h3.xpath('span')[0].text)

    print len(all_team_name)

    all_coach_p = html.xpath('/html/body/p')
    all_player_tables = html.xpath('/html/body/table')
    all_coach = []
    count = 0
    for p in all_coach_p:
        coach_text = p.text
        if not re.search('^Coach', coach_text):
            continue

        team = {}
        team['name'] = all_team_name[count]
        team['coach'] = p.xpath('a')[0].text

        trs = all_player_tables[count].xpath('tr')

        index = 0
        players = []
        for tr in trs:
            player = {}
            if index == 0:
                index = index + 1
                continue

            if tr.attrib and 'class' in tr.attrib.keys():
                continue
            tds = tr.xpath('td')
            player['pos'] = tds[1].xpath('a')[0].text
            if tr.xpath('th/a'):
                player['name'] = tr.xpath('th/a')[0].text
            else:
                player['name'] = tr.xpath('th/span')[1].xpath('span/a')[0].text
            player['bday'] = tds[2].xpath('span/span')[0].text
            player['age'] = tds[2].xpath('span')[0].tail[-3:-1]
            index = index + 1
            players.append(player)

        team['players'] = players
        team['group'] = all_group[count % 8]

        teams.append(team)
        count = count + 1

    # print teams
    print len(teams)
    print teams[0]

    with open('teams.json', 'w') as f:
        f.write(json.dumps(teams))
