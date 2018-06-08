# worldcup-2018

## Endpoint
https://worldcup.kuang1987.me

## API
### 1. RESTful API
#### 1.1 Login

###### POST /api/login

Request:  
<pre>
Content-Type: application/json

{  
  "email": "test@seedlinktech.com",  
  "password": "xxxxxx"  
}
</pre>

Response:
- Auth Success
<pre>
Status Code: 200

{
  "token": "#JWT token#"
}
</pre>
- Auth Failure
<pre>
Status Code: 403

{
  "message": "Authentication failed. Invalid user or password."
}
</pre>
- Auth Need Change password
<pre>
Status Code: 401

{
  "message": "Password need change."
}
</pre>

###### POST /api/changePassword
Request:
<pre>
Content-Type: application/json

{  
  "email": "test@seedlinktech.com",  
  "old_password": "xxxxxx",
  "new_password": "yyyyyy",
  "new_password_confirm": "yyyyyy"
}
</pre>

Response:
- Success
<pre>
Status Code: 200

{
  "token": "#JWT token#"
}
</pre>
- Failure
<pre>
Status Code: 403

{
  "message": "Authentication failed. Invalid user or password."
}
</pre>
<pre>
Status Code: 401

{
  "message": "New password is not consistent with confirm passowrd."
}
</pre>
<pre>
Status Code: 401

{
  "message": "New password is same with new password."
}
</pre>


### 2. GraphQL API
#### Basic
###### POST /graphql
<pre>
Headers:
Content-Type: application/json
Authorization: Bearer #JWT token#
</pre>

#### Schema
###### Query
**- Current User (BE get user id from JWT token)**

Request
<pre>
{
	User{
		_id
		nickName
		email
    timezone
		matchGuessRecords{
			_id
			match
			guess
		}
		guessScore
		goldenPlayerGuessRecord
	}
}
</pre>

Response
<pre>
{
	"data": {
		"User": {
			"_id": "5b1aa26f5f4c4d0811c789a8",
			"nickName": "",
			"email": "test-99@seedlinktech.com",
			"matchGuessRecords": [],
			"guessScore": 0,
			"goldenPlayerGuessRecord": null
		}
	}
}
</pre>

**- Users Score Ranking**  
Request
<pre>
{
	UsersRanking{
		nickName
		email
		guessScore
		goldenPlayerGuessRecord
	}
}
</pre>
Response
<pre>
{
	"data": {
		"UsersRanking": [
			{
				"nickName": "",
				"email": "test-00@seedlinktech.com",
				"guessScore": 0,
				"goldenPlayerGuessRecord": ""
			},
			{
				"nickName": "",
				"email": "test-01@seedlinktech.com",
				"guessScore": 0,
				"goldenPlayerGuessRecord": ""
			},
      ...
    ]
  }
}
</pre>

**- Teams**  
Request
<pre>
{
	Teams{
		_id
		name
		flagUrl
		group
		groupScore
		players{
			_id
			name
			age
			goal
			pos
		}
	}
}
</pre>
Response
<pre>
"data": {
  "Teams": [
    {
      "_id": "5b1aa1d808eb9607dccef1ef",
      "name": "Egypt",
      "flagUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/900px-Flag_of_Egypt.png",
      "group": "A",
      "groupScore": 0,
      "players": [
        {
          "_id": "5b1aa1d808eb9607dccef20c",
          "name": "Essam El-Hadary",
          "age": 45,
          "goal": 0,
          "pos": "GK"
        },
        {
          "_id": "5b1aa1d808eb9607dccef20b",
          "name": "Sherif Ekramy",
          "age": 34,
          "goal": 0,
          "pos": "GK"
        },
        ...
        ]
      }
    ...
    ]
  }
}
</pre>

**- Players**  
Filter Params
<pre>
team - which team of player
minGoals - Players goals > minGoals
</pre>
Request
<pre>
{
	Players(team: "Argentina", minGoals: 0){
			_id
			team
			name
			age
			goal
			pos
		  teamFlagUrl
	}
}
</pre>
Response
<pre>
{
	"data": {
		"Players": [
			{
				"_id": "5b1aa1d808eb9607dccef4fe",
				"team": "Argentina",
				"name": "Cristian Ansaldi",
				"age": null,
				"goal": 0,
				"pos": "DF",
				"teamFlagUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/800px-Flag_of_Argentina.png"
			},
			{
				"_id": "5b1aa1d808eb9607dccef4ec",
				"team": "Argentina",
				"name": "Cristian PavÃ³n",
				"age": null,
				"goal": 0,
				"pos": "MF",
				"teamFlagUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Flag_of_Argentina.svg/800px-Flag_of_Argentina.png"
			},
      ...
    ]
  }
}
</pre>

**- Supported Timezone List**  
Note  
<pre>
1. In Front End, user can choose their own timezone via a dropdown.  
2. Display format in dropdown.
#value# (UTC#offset#) - "Atlantic/Azores (UTC+00:00)"
3. In "User" mutation, "timezone" should be set to #value# in tz object - eg. "Atlantic/Azores"
</pre>
Request
<pre>
{
	Tz{
		_id
		index
		value
		text
		place
		offset
	}
}
</pre>
Response
<pre>
{
	"data": {
		"Tz": [
			{
				"_id": "5b1aa1e684711207ed5b6040",
				"index": 32,
				"value": "Atlantic/Azores",
				"text": "(UTC+00:00) Azores",
				"place": "Azores",
				"offset": "+00:00"
			},
			{
				"_id": "5b1aa1e684711207ed5b6042",
				"index": 34,
				"value": "Africa/Casablanca",
				"text": "(UTC+00:00) Casablanca",
				"place": "Casablanca",
				"offset": "+00:00"
			},
    ...
  ]
}
</pre>

**- Matches**  
Params
<pre>
available - available to guess
started - match started or not
label - in group stage: Enum['A',...'H'], in knockout stage: Enum['Round_of_16', 'Quarter_finals', 'Semi_finals', 'Third_place_play_off', 'Final']
stage - Enum['group', 'knockout']
</pre>
Note  
<pre>
In Front End, Use 3 tabs to list matches  

On guessing Match - available && !started
Guess History Match - !available && started
To guess Match - !available && !started
</pre>
Request
<pre>
{
	Match{
		matchIndex        //order key
		homeTeam          //team id
		awayTeam          //team id
		homeTeamScore     // -1 indicates match not finished
		awayTeamScore     // -1 indicates match not finished
		startTime         // match start time according to user timezone setting
		stage              
		label             
		winner            // team id str. "draw" indicates draw
		available         // available to guess
    endWay            // Enum['NR','OT','PN'] NR - ends in 90 mins; OT - ends in over time; PN - ends with penalty
	}
}
</pre>
Response
<pre>
{
	"data": {
		"Match": [
			{
				"matchIndex": 51,
				"homeTeam": null,
				"awayTeam": null,
				"homeTeamScore": -1,
				"awayTeamScore": -1,
				"startTime": "2018-07-01 02:00:00 UTC+00:00",
				"stage": "knockout",
				"label": "Round_of_16",
				"winner": null,
				"available": false,
				"finished": false
			},
			{
				"matchIndex": 56,
				"homeTeam": null,
				"awayTeam": null,
				"homeTeamScore": -1,
				"awayTeamScore": -1,
				"startTime": "2018-07-03 06:00:00 UTC+00:00",
				"stage": "knockout",
				"label": "Round_of_16",
				"winner": null,
				"available": false,
				"finished": false
			},
    ...
    ]
  }
}
</pre>

###### Mutation
**- User**  
Note  
<pre>
1. In BE, user id got from JWT token
</pre>
Input  
<pre>
nickName
timezone                  # in "Asia/Chongqing" format
matchGuessRecord          # user's guess against matches
  match                   # match id
  guess                   # homeTeam/awayTeam id string or "draw"
goldenPlayerGuessRecord   #player id
</pre>
Request
<pre>
mutation{
	User(
    data:{
		  nickName: "kevin"
		  timezone: "Asia/Chongqing"
		  matchGuessRecord: {
			 match: "5b1aa1331b9c34de44c946eb"
			 guess: "draw"
		  }
		  goldenPlayerGuessRecord: "5b1aa12739b04ade42013b74"
	 }){
		  nickName
		  matchGuessRecords{
			 match
			 guess
		  }
		  goldenPlayerGuessRecord
		  email
		  timezone
	}
}
</pre>
