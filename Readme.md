# Web3 ChatGPT Backend

###### LINKS

- [Backend Server](http://13.51.252.66)

- [Landing Page](http://13.53.138.223)

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
  descriptorTitle: String,
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
  rate: Number,
  skills: [
    String
  ],
  agreements: [
    agreement_id
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
  manager: user_id,
  skills: [String],
  img: String,              // ipfs string
  secondaryImg: String,     // ipfs string
  isVerified: Boolean,      // For Blue tick
  createdAt: Date,
  updatedAt: Date
}
```

### Agreement

```js
{
  _id: agreement_id,
  name: String,
  agreementUri: String, // IPFS URI
  contractAddress: String,
  user1: user_id,
  user2: user_id,
  reviewForU1: String,
  ratingForU1: Number,
  reviewForU2: String,
  ratingForU2: Number,
  startsAt: Number,
  endsAt: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Room

```js
{
  _id: room_id,
  p1: user_id,
  p2: user_id,
  createdAt: Date,
  updatedAt: Date
}
```

### Chat (Message)

```js
{
  _id: chat_id,
  chatMessage: String,
  sender: user_id,
  type: String,
  roomId: _id, // room_id or group_id
  createdAt: Date,
  updatedAt: Date
}
```

### User

#### 🟢 `GET: /api/v1/user/users` ✔️

###### Query

| KEY    | VALUE   | REQUIRED | DEFAULT |
| ------ | ------- | -------- | ------- |
| expert | Boolean | No       | False   |

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

| KEY    | VALUE   | REQUIRED | DEFAULT |
| ------ | ------- | -------- | ------- |
| page   | Number  | No       | 1       |
| size   | Number  | No       | 10      |
| expert | Boolean | No       | False   |

###### RESPONSE

```js
[{ ...User }]
```

#### 🟢 `GET: /api/v1/user/users/search` ✔️

###### Query

| KEY    | VALUE   | REQUIRED | DEFAULT |
| ------ | ------- | -------- | ------- |
| q      | String  | No       | ""      |
| expert | Boolean | No       | False   |

###### RESPONSE

```js
[{ ...User }]
```

#### 🟢 `GET: /api/v1/user/login` ✔️

###### Query

| KEY       | VALUE  | REQUIRED | DEFAULT |
| --------- | ------ | -------- | ------- |
| signature | String | Yes      |         |
| address   | String | Yes      |         |

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

| KEY             | VALUE    | REQUIRED | DEFAULT |
| --------------- | -------- | -------- | ------- |
| walletAddress   | String   | Yes      |         |
| username        | String   | No       | Unnamed |
| descriptorTitle | String   | No       |
| bio             | String   | No       |         |
| email           | String   | No       |         |
| profileImage    | String   | No       |         |
| profileBanner   | String   | No       |         |
| socialHandles   | [Social] | No       |         |
| scripts         | [String] | No       |         |
| rate            | Number   | No       | 0       |
| skills          | [String] | No       |         |

Social => {
name: String,
link: String
}

###### RESPONSE

```js
{ ...User }
```

#### 🟠 `POST: /api/v1/user/agreement` ✔️

###### BODY

| KEY             | VALUE   | REQUIRED | DEFAULT |
| --------------- | ------- | -------- | ------- |
| name            | String  | Yes      |         |
| agreementUri    | String  | No       |         |
| contractAddress | String  | No       |         |
| user1           | user_id | No       |         |
| user2           | user_id | No       |         |
| reviewForU1     | String  | No       |         |
| ratingForU1     | Number  | No       | 5       |
| reviewForU2     | String  | No       |         |
| ratingForU2     | Number  | No       | 5       |
| startsAt        | Number  | No       |         |
| endsAt          | Number  | No       |         |

###### RESPONSE

```js
{ ...Agreement }
```

#### 🟡 `PUT: /api/v1/user/agreement/:id` ✔️

###### BODY

| KEY             | VALUE  | REQUIRED | DEFAULT |
| --------------- | ------ | -------- | ------- |
| contractAddress | String | No       |         |
| reviewForU1     | String | No       |         |
| ratingForU1     | Number | No       | 5       |
| reviewForU2     | String | No       |         |
| ratingForU2     | Number | No       | 5       |
| startsAt        | Number | No       |         |
| endsAt          | Number | No       |         |

###### RESPONSE

```js
{ ...Agreement }
```

#### 🟢 `GET: /api/v1/user/agreements/:user_id` ✔️

###### RESPONSE

```js
[{ ...Agreement }]
```

#### 🟠 `POST: /api/v1/user/metatx` ✔️

###### BODY

| KEY       | REQUIRED |
| --------- | -------- |
| tx        | Yes      |
| signature | Yes      |

```js
// Example snippet for frontend
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send('eth_requestAccounts', []);

const signer = provider.getSigner();
const from = await signer.getAddress(); // My wallet address

const forwarderC = new ethers.Contract(
  '0x740f39D16226c00bfb7932a8087778a7Ce6A92FB',
  Forwarder.abi,
  signer
);
const contractInterface = new ethers.utils.Interface(AskGPT.abi);

const data = contractInterface.encodeFunctionData('createAgreement', [
  'ipfsUri',
  17882979712,
  'Movie Script Writer',
  '0x1fA331B16655AE94eAe82FA5f89950d9C977903A',
]);

const nonce = await forwarderC.getNonce(from);
const tx = {
  from,
  to: '0x8E38A526b11a42c5baEB5866d9dad0e6f1b2790C', // Target contract address (AskGPT or Agreement subcontract)
  value: 0,
  nonce,
  data,
};
const digest = await forwarderC.getDigest(
  tx.from,
  tx.to,
  tx.value,
  tx.nonce,
  tx.data
);
const signature = await signer.signMessage(ethers.utils.arrayify(digest));

const res = await axios.post('http://localhost/api/v1/user/metatx', {
  tx,
  signature,
});
```

###### RESPONSE

```js
{
  success: Boolean;
  data: OBJECT
}
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

#### 🟢 `GET: /api/v1/brand/user/:manager_id` ✔️

###### RESPONSE

```js
[{ ...Brand }]
```

#### 🟠 `POST: /api/v1/brand/` ✔️

###### BODY

| KEY          | VALUE    | REQUIRED | DEFAULT |
| ------------ | -------- | -------- | ------- |
| name         | String   | Yes      |         |
| nickname     | String   | No       |         |
| description  | String   | No       |         |
| skills       | [String] | No       |         |
| img          | String   | No       |         |
| secondaryImg | String   | No       |         |
| isVerified   | Boolean  | No       | false   |

###### RESPONSE

```js
{ ...Brand }
```

#### 🟡 `PUT: /api/v1/brand/:id` ✔️

###### BODY

| KEY          | VALUE    | REQUIRED | DEFAULT |
| ------------ | -------- | -------- | ------- |
| name         | String   | Yes      |         |
| nickname     | String   | No       |         |
| description  | String   | No       |         |
| skills       | [String] | No       |         |
| img          | String   | No       |         |
| secondaryImg | String   | No       |         |
| isVerified   | Boolean  | No       | false   |

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

| KEY | VALUE  | REQUIRED | DEFAULT |
| --- | ------ | -------- | ------- |
| q   | String | No       | ""      |

###### RESPONSE

```js
[{ ...Brand }]
```

#### 🟢 `GET: /api/v1/brand/brands/paginated` ✔️

###### Query

| KEY  | VALUE  | REQUIRED | DEFAULT |
| ---- | ------ | -------- | ------- |
| page | Number | No       | 1       |
| size | Number | No       | 10      |

###### RESPONSE

```js
[{ ...Brand }]
```

### GPT

#### 🟠 `POST: /api/v1/gpt/ask` ✔️

###### BODY

| KEY    | VALUE  | REQUIRED | DEFAULT |
| ------ | ------ | -------- | ------- |
| prompt | String | Yes      |         |

###### RESPONSE

```js
String;
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

### Chat

#### 🟢 `GET: /api/v1/chat/` ✔️

###### RESPONSE

```js
[{ ...Room }]
```

#### 🟠 `POST: /api/v1/chat/room` ✔️

###### BODY

| KEY      | VALUE   | REQUIRED | DEFAULT |
| -------- | ------- | -------- | ------- |
| receiver | user_id | Yes      |         |

###### RESPONSE

```js
{ ...Room }
```

#### 🟢 `GET: /api/v1/chat/room/:id` ✔️

###### RESPONSE

```js
{ ...Room }
```

#### 🔴 `DELETE: /api/v1/chat/room/:id` ✔️

#### 🔴 `DELETE: /api/v1/chat/msg/:id` ✔️
