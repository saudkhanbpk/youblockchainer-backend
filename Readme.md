# Web3 ChatGPT Backend

###### LINKS

- [Backend Server](http://13.51.252.66)

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
  scripts: [
    String // IPFS link to docs
  ],
  isExpert: Boolean,
  isVerified: Boolean,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Brand
  
```js
{
  _id: brand_id,
  name: String,             // Eg. Adidas
  nickname: String,         // @...
  description: String,  
  walletAddress: String,    // Of associated user/representative
  img: String,              // ipfs string
  secondaryImg: String,     // ipfs string
  isVerified: Boolean,      // For Blue tick
  createdAt: Date,
  updatedAt: Date
}
```

### User

#### 🟢 `GET: /api/v1/user/users` ✔️

###### Query

| KEY    | VALUE     | REQUIRED | DEFAULT |
| ------ | --------- | -------- | ------- |
| expert | Boolean   | No       | False   |

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
| expert | Boolean   | No       | False   |

###### RESPONSE

```js
[{ ...User }]
```

#### 🟢 `GET: /api/v1/user/users/search` ✔️

###### Query

| KEY    | VALUE     | REQUIRED | DEFAULT |
| ------ | --------- | -------- | ------- |
| q      | String    | No       | ""      |
| expert | Boolean   | No       | False   |

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
| username      | String   | No       | Unnamed |
| bio           | String   | No       |         |
| email         | String   | No       |         |
| profileImage  | String   | No       |         |
| profileBanner | String   | No       |         |
| socialHandles | [Social] | No       |         |
| scripts       | [String] | No       |         |

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

### Brand

#### 🟢 `GET: /api/v1/brand/` ✔️

###### RESPONSE

```js
[{ ...Brand }]
```

#### 🟢 `GET: /api/v1/brand/:id` ✔️

###### RESPONSE

```js
{ ...Brand }
```

#### 🟢 `GET: /api/v1/brand/user/:walletAddress` ✔️

###### RESPONSE

```js
[{ ...Brand }]
```

#### 🟠 `POST: /api/v1/brand/` ✔️

###### BODY

| KEY             | VALUE       | REQUIRED | DEFAULT |
| --------------- | ----------- | -------- | ------- |
| name            | String      | Yes      |         |
| nickname        | String      | No       |         |
| description     | String      | No       |         |
| walletAddress   | String      | No       |         |
| img             | String      | No       |         |
| secondaryImg    | String      | No       |         |
| isVerified      | Boolean     | No       | false   |

###### RESPONSE

```js
{ ...Brand }
```

#### 🟡 `PUT: /api/v1/brand/:id` ✔️ 
  
###### BODY

| KEY             | VALUE       | REQUIRED | DEFAULT |
| --------------- | ----------- | -------- | ------- |
| name            | String      | Yes      |         |
| nickname        | String      | No       |         |
| description     | String      | No       |         |
| walletAddress   | String      | No       |         |
| img             | String      | No       |         |
| secondaryImg    | String      | No       |         |
| isVerified      | Boolean     | No       | false   |

###### RESPONSE

```js
{ ...Brand }
```

#### 🟡 `PUT: /api/v1/brand/verify/:id` ⚠️ 

###### RESPONSE

```js
{ ...Brand }
```

#### 🟡 `PUT: /api/v1/brand/blacklist/:id` ⚠️ 

###### RESPONSE

```js
{ ...Brand }
```

#### 🔴 `DELETE: /api/v1/brand/` ⚠️

#### 🔴 `DELETE: /api/v1/brand/:id` ⚠️

#### 🟢 `GET: /api/v1/brand/brands/search` ✔️

###### Query

| KEY    | VALUE     | REQUIRED | DEFAULT |
| ------ | --------- | -------- | ------- |
| q      | String    | No       | ""      |

###### RESPONSE

```js
[{ ...Brand }]
```

#### 🟢 `GET: /api/v1/brand/brands/paginated` ✔️

###### Query

| KEY    | VALUE     | REQUIRED | DEFAULT |
| ------ | --------- | -------- | ------- |
| page   | Number    | No       | 1       |
| size   | Number    | No       | 10      |

###### RESPONSE

```js
[{ ...Brand }]
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

### IPFS

#### 🟠 `POST: /api/v1/ipfs/img` ✔️

###### BODY

| KEY   | VALUE  | REQUIRED | DEFAULT |
| ----- | ------ | -------- | ------- |
| files | [file] | Yes      |         |

###### RESPONSE

```js
{
  success: Boolean,
  urls: [String],
}
```

#### 🟠 `POST: /api/v1/ipfs/json` ✔️

###### BODY

Any JSON object

###### RESPONSE

```js
{
  success: Boolean,
  url: String,
}
```