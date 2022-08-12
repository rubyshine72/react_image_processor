
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Settings on AWS S3
Please reference this article [How to Upload Files to AWS S3 in React](https://javascript.plainenglish.io/how-to-upload-files-to-aws-s3-in-react-591e533d615e)


## Database
Sqlite is used for the dev environment.

Please run the following command for migrate sqlite database.
```
npx prisma migrate dev
```

This command will generate a sqlite db file. ```prisma/dev.db```


## Postman
You can test APIs using Postman tool, you need to just import ```postman_collection.json``` file on the Postmant tool.
