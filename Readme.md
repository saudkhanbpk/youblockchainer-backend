# Web3 ChatGPT Backend

###### LINKS

- [Backend Server]()

###### SYMBOLS

- 📝 PENDING
- ✔️ FINISHED
- ⚠️ NOT FOR APP (ADMIN ONLY)
- 🟢 GET
- 🟠 POST
- 🟡 PUT
- 🔴 DELETE

## Schemas

### User
  
```js
{
  _id: user_id,
  walletAddress: String,
  username: String,
  bio: String,
  email: String,
  profileImage: String, // IPFS string
  profileBanner: String, // IPFS string
  email: String,
  socialHandles: [
    {
      name: String, // Eg. Twitter
      link: String, // Eg. twitterHandleLink
    }
  ],
  followers: [
    user_id
  ],
  following: [
    user_id
  ],
  isVerifiedCreator: Boolean,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### User

#### 🟢 `GET: /api/v1/user/users` ✔️

###### RESPONSE

```js
[{ ...User }]
```

#### 🟢 `GET: /api/v1/user/verified` ✔️

###### RESPONSE

```js
[{ ...User }]
```

#### 🟢 `GET: /api/v1/user/pending` ✔️

###### RESPONSE

```js
[{ ...User }]
```

#### 🟢 `GET: /api/v1/user/users/paginated` ✔️

###### Query

| KEY    | VALUE     | REQUIRED | DEFAULT |
| ------ | --------- | -------- | ------- |
| page   | Number    | No       | 1       |
| size   | Number    | No       | 10      |

###### RESPONSE

```js
[{ ...User }]
```

#### 🟢 `GET: /api/v1/user/users/search` ✔️

###### Query

| KEY    | VALUE     | REQUIRED | DEFAULT |
| ------ | --------- | -------- | ------- |
| q      | String    | No       | ""      |

###### RESPONSE

```js
[{ ...User }]
```

#### 🟢 `GET: /api/v1/user/login` ✔️

###### Query

| KEY       |   VALUE   | REQUIRED | DEFAULT |
| --------- | --------- | -------- | ------- |
| signature | String    | Yes      |         |
| address   | String    | Yes      |         |

###### RESPONSE

```js
{
  user: User,
  token: String
}
```

#### 🟢 `GET: /api/v1/user/users/:walletAddress` ✔️

###### RESPONSE

```js
{ ...User }
```

#### 🟢 `GET: /api/v1/user/users/:id` ✔️

###### RESPONSE

```js
{ ...User }
```

#### 🟢 `GET: /api/v1/user/me` ✔️

###### RESPONSE

```js
{ ...User }
```

#### 🟡 `PUT: /api/v1/user/me` ✔️ 

###### BODY

| KEY           | VALUE    | REQUIRED | DEFAULT |
| ------------- | -------- | -------- | ------- |
| walletAddress | String   | Yes      |         |
| favorites     | [Offer]  | No       |         |
| favoriteItems | [Item]   | No       |         |
| claimed       | [Offer]  | No       |         |
| redeemed      | [Offer]  | No       |         |
| created       | [Offer]  | No       |         |
| username      | String   | No       | Unnamed |
| bio           | String   | No       |         |
| email         | String   | No       |         |
| profileImage  | String   | No       |         |
| profileBanner | String   | No       |         |
| socialHandles | [Social] | No       |         |

Social => {
  name: String,
  link: String
}

###### RESPONSE

```js
{ ...User }
```

#### 🟡 `PUT: /api/v1/user/toggleFollow/:id` ✔️ 

###### RESPONSE

```js
{ ...User }
```

#### 🟡 `PUT: /api/v1/user/verify/:id` ⚠️ 

###### RESPONSE

```js
{ ...User }
```

### GPT

#### 🟠 `POST: /api/v1/gpt/ask` ✔️ 

###### BODY

| KEY    | VALUE    | REQUIRED | DEFAULT |
| -------| -------- | -------- | ------- |
| prompt | String   | Yes      |         |

###### RESPONSE

```js
String
```
