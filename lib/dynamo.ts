import { Resource } from "sst";
import {
  AttributeValue,
  DynamoDBClient,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import {
  BatchGetCommand,
  DynamoDBDocumentClient,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
console.log(process.env);
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

export async function get() {
  let last: Record<string, AttributeValue> | undefined;
  const results = [];
  while (true) {
    console.log(last);
    const response = await docClient.send(
      new ScanCommand({
        TableName: Resource.Movies.tableName,
        ExclusiveStartKey: last,
      }),
    );
    if (!response.LastEvaluatedKey) {
      break;
    }
    results.push(...response.Items!);
    last = response.LastEvaluatedKey;
  }
  return results.map((item) => ({
    id: item.id.S!,
    data: JSON.parse(item.data.S!),
  }));
}

export async function getById(id: string) {
  const result = await docClient.send(
    new GetCommand({
      TableName: Resource.Movies.tableName,
      Key: {
        id,
      },
    }),
  );
  console.log(result.Item?.data);
  return {
    id: result.Item?.id! as string,
    data: JSON.parse(result.Item?.data!),
  };
}

export async function batchGet(ids: string[]) {
  return ids.length === 0
    ? []
    : await docClient
        .send(
          new BatchGetCommand({
            RequestItems: {
              [Resource.Movies.tableName]: {
                Keys: ids.map((id) => ({ id: id })),
              },
            },
          }),
        )
        .then((response) =>
          response.Responses![Resource.Movies.tableName].map((item) => ({
            id: item.id! as string,
            data: JSON.parse(item.data!),
          })),
        );
}
