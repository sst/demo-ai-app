import fs from "fs/promises";
import data from "./data/movies.data";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

import { Resource, VectorClient } from "sst";
import * as Cheerio from "cheerio";
import { queue } from "./lib/queue";

const s3 = new S3Client({});
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const vector = VectorClient("Vector");

async function load() {
  const ids = [
    "tt0111161",
    "tt0468569",
    "tt1375666",
    "tt0137523",
    "tt0109830",
    "tt0110912",
    "tt0816692",
    "tt0133093",
    "tt0068646",
    "tt0120737",
    "tt0167260",
    "tt1345836",
    "tt0114369",
    "tt0167261",
    "tt1853728",
    "tt0172495",
    "tt0372784",
    "tt0361748",
    "tt0993846",
    "tt0102926",
    "tt0120815",
    "tt0848228",
    "tt7286456",
    "tt0076759",
    "tt0108052",
    "tt1130884",
    "tt0482571",
    "tt0407887",
    "tt0120689",
    "tt0499549",
    "tt0080684",
    "tt0071562",
    "tt0209144",
    "tt0088763",
    "tt0120338",
    "tt2015381",
    "tt4154796",
    "tt0099685",
    "tt0110413",
    "tt0169547",
    "tt0325980",
    "tt0910970",
    "tt4154756",
    "tt0266697",
    "tt0120586",
    "tt0120382",
    "tt0434409",
    "tt0103064",
    "tt0114814",
    "tt0110357",
    "tt0371746",
    "tt1049413",
    "tt0086190",
    "tt1431045",
    "tt0266543",
    "tt0081505",
    "tt0112573",
    "tt0105236",
    "tt0264464",
    "tt1392190",
    "tt0338013",
    "tt0073486",
    "tt0114709",
    "tt0107290",
    "tt2267998",
    "tt0119217",
    "tt0477348",
    "tt0167404",
    "tt0082971",
    "tt1392170",
    "tt0268978",
    "tt2488496",
    "tt0198781",
    "tt2582802",
    "tt0078748",
    "tt0095016",
    "tt1201607",
    "tt6751668",
    "tt1675434",
    "tt0088247",
    "tt2395427",
    "tt3659388",
    "tt0075314",
    "tt0086250",
    "tt0208092",
    "tt0253474",
    "tt0800369",
    "tt1300854",
    "tt1843866",
    "tt0180093",
    "tt0458339",
    "tt0435761",
    "tt2278388",
    "tt0066921",
    "tt1010048",
    "tt0145487",
    "tt0903624",
    "tt1663202",
    "tt1228705",
    "tt10872600",
    "tt0416449",
    "tt1454468",
    "tt0118715",
    "tt0050083",
    "tt0120915",
    "tt0241527",
    "tt0246578",
    "tt3498820",
    "tt0121766",
    "tt1119646",
    "tt0245429",
    "tt1825683",
    "tt7131622",
    "tt3315342",
    "tt2084970",
    "tt0947798",
    "tt0083658",
    "tt1205489",
    "tt0382932",
    "tt0770828",
    "tt3501632",
    "tt0480249",
    "tt0097576",
    "tt0060196",
    "tt0317705",
    "tt0378194",
    "tt1211837",
    "tt0317248",
    "tt1392214",
    "tt0401792",
    "tt0892769",
    "tt0211915",
    "tt0093058",
    "tt2096673",
    "tt1877830",
    "tt0383574",
    "tt8946378",
    "tt0090605",
    "tt2543164",
    "tt0121765",
    "tt1285016",
    "tt3896198",
    "tt2975590",
    "tt1160419",
    "tt1877832",
    "tt1045658",
    "tt2024544",
    "tt0118799",
    "tt2911666",
    "tt5013056",
    "tt1631867",
    "tt1074638",
    "tt0126029",
    "tt0117951",
    "tt1981115",
    "tt1270798",
    "tt1386697",
    "tt0116282",
    "tt0405159",
    "tt0478970",
    "tt1951264",
    "tt1136608",
    "tt0054215",
    "tt0062622",
    "tt0816711",
    "tt2250912",
    "tt0113277",
    "tt2802144",
    "tt1504320",
    "tt0078788",
    "tt1670345",
    "tt0144084",
    "tt0316654",
    "tt1170358",
    "tt0457430",
    "tt0780504",
    "tt0948470",
    "tt0451279",
    "tt0381061",
    "tt0421715",
    "tt0449088",
    "tt0295297",
    "tt0304141",
    "tt5052448",
    "tt3748528",
    "tt0107048",
    "tt0369610",
    "tt0330373",
    "tt0418279",
    "tt2527336",
    "tt1745960",
    "tt0988045",
    "tt0454876",
    "tt2562232",
    "tt8579674",
    "tt1798709",
    "tt2294629",
    "tt0440963",
    "tt4633694",
    "tt3783958",
    "tt0758758",
    "tt0073195",
    "tt3460252",
    "tt1637725",
    "tt0099785",
    "tt1856101",
    "tt0114746",
    "tt0120903",
    "tt1446714",
    "tt1024648",
    "tt0469494",
    "tt5463162",
    "tt0162222",
    "tt0413300",
    "tt0936501",
    "tt0373889",
    "tt0364569",
    "tt0234215",
    "tt0829482",
    "tt0075148",
    "tt0796366",
    "tt1156398",
    "tt0120363",
    "tt0119488",
    "tt0240772",
    "tt0120735",
    "tt0332280",
    "tt1219289",
    "tt0119654",
    "tt4154664",
    "tt15398776",
    "tt0116629",
    "tt0034583",
    "tt1276104",
    "tt3890160",
    "tt1396484",
    "tt2872718",
    "tt1232829",
    "tt0926084",
    "tt1250777",
    "tt0443706",
    "tt0365748",
    "tt1343092",
    "tt0417741",
    "tt11286314",
    "tt2119532",
    "tt1727824",
    "tt0450259",
    "tt0181689",
    "tt0470752",
    "tt0409459",
    "tt1323594",
    "tt6723592",
    "tt2380307",
    "tt6644200",
    "tt10811166",
    "tt0290334",
    "tt0258463",
    "tt0343818",
    "tt0096874",
    "tt0071853",
    "tt2310332",
    "tt0332452",
    "tt1298650",
    "tt0112641",
    "tt1570728",
    "tt1318514",
    "tt0454921",
    "tt6966692",
    "tt1022603",
    "tt1483013",
    "tt1457767",
    "tt5027774",
    "tt6320628",
    "tt0467406",
    "tt0945513",
    "tt1659337",
    "tt4972582",
    "tt0095953",
    "tt0242653",
    "tt2948356",
    "tt0376994",
    "tt2713180",
    "tt0097165",
    "tt0356910",
    "tt1872181",
    "tt0425112",
    "tt0087469",
    "tt1270797",
    "tt1411697",
    "tt2872732",
    "tt0314331",
    "tt0458525",
    "tt1663662",
    "tt0206634",
    "tt1229238",
    "tt2179136",
    "tt0367594",
    "tt0800080",
    "tt0099487",
    "tt0047396",
    "tt0289879",
    "tt0790636",
    "tt0057012",
    "tt1477834",
    "tt0268380",
    "tt0449059",
    "tt0441773",
    "tt0448157",
    "tt1979320",
    "tt6710474",
    "tt4425200",
    "tt3183660",
    "tt1790864",
    "tt0119116",
    "tt0298148",
    "tt1800241",
    "tt1895587",
    "tt1951265",
    "tt1408101",
    "tt0092099",
    "tt2245084",
    "tt0038650",
    "tt1291584",
    "tt0362227",
    "tt1568346",
    "tt0367882",
    "tt1430132",
    "tt1535109",
    "tt0398286",
    "tt1454029",
    "tt2527338",
    "tt1840309",
    "tt0372183",
    "tt1099212",
    "tt0335266",
    "tt1723121",
    "tt0327056",
    "tt1630029",
    "tt2980516",
    "tt1515091",
    "tt0101414",
    "tt0099088",
    "tt1596363",
    "tt0974015",
    "tt1677720",
    "tt0319262",
    "tt0407304",
    "tt0887912",
    "tt0217505",
    "tt0830515",
    "tt9419884",
    "tt1535108",
    "tt1499658",
    "tt0139654",
    "tt1517268",
    "tt0325710",
    "tt3397884",
    "tt0117060",
    "tt2103281",
    "tt2379713",
    "tt0033467",
    "tt0405422",
    "tt0387564",
    "tt0446029",
    "tt0317219",
    "tt0084787",
    "tt0103639",
    "tt1210166",
    "tt0780536",
    "tt3385516",
    "tt0319061",
    "tt0120616",
    "tt0382625",
    "tt0458352",
    "tt1950186",
    "tt1772341",
    "tt0070047",
    "tt0765429",
    "tt0093773",
    "tt0375679",
    "tt0093779",
    "tt0120591",
    "tt1605783",
    "tt1259521",
    "tt3170832",
    "tt5095030",
    "tt5580390",
    "tt0942385",
    "tt0360717",
    "tt1637688",
    "tt0087332",
    "tt0119567",
    "tt1355644",
    "tt0289043",
    "tt2382320",
    "tt0347149",
    "tt0217869",
    "tt1217209",
    "tt1014759",
    "tt0443453",
    "tt0092005",
    "tt0831387",
    "tt0091763",
    "tt0083866",
    "tt12361974",
    "tt2584384",
    "tt0105695",
    "tt1245492",
    "tt0351283",
    "tt0088847",
    "tt0163651",
    "tt1399103",
    "tt0369339",
    "tt0315327",
    "tt1187043",
    "tt11564570",
    "tt9376612",
    "tt0119698",
    "tt1055369",
    "tt1302006",
    "tt0032138",
    "tt0119174",
    "tt0377092",
    "tt0363771",
    "tt0086879",
    "tt0052357",
    "tt1690953",
    "tt0099674",
    "tt0079470",
    "tt0265086",
    "tt0337978",
    "tt3480822",
    "tt6146586",
    "tt1060277",
    "tt0181852",
    "tt2283362",
    "tt6264654",
    "tt0232500",
    "tt0110475",
    "tt1905041",
    "tt1517451",
    "tt1282140",
    "tt0361862",
    "tt0455944",
    "tt0840361",
    "tt2820852",
    "tt0349903",
    "tt0109686",
    "tt0405094",
    "tt2381249",
    "tt12593682",
    "tt0493464",
    "tt0112864",
    "tt1596343",
    "tt2294449",
    "tt0096895",
    "tt6334354",
    "tt0120912",
    "tt0104431",
    "tt2582846",
    "tt1542344",
    "tt0118971",
    "tt0119094",
    "tt1587310",
    "tt1190080",
    "tt0454848",
    "tt10648342",
    "tt1632708",
    "tt0230600",
    "tt8772262",
    "tt0443543",
    "tt0111257",
    "tt0317919",
    "tt0964517",
    "tt0317740",
    "tt0328107",
    "tt1453405",
    "tt1706620",
    "tt0408236",
    "tt1490017",
    "tt0117571",
    "tt1409024",
    "tt0286106",
    "tt0091042",
    "tt0478311",
    "tt8367814",
    "tt0338751",
    "tt0162661",
    "tt0099423",
    "tt2194499",
    "tt0448115",
    "tt1068680",
    "tt2737304",
    "tt0166924",
    "tt9032400",
    "tt0388795",
    "tt0343660",
    "tt0147800",
    "tt0357413",
    "tt0081398",
    "tt0438488",
    "tt3778644",
    "tt1182345",
    "tt0120755",
    "tt0087843",
    "tt1907668",
    "tt9764362",
    "tt0477347",
    "tt0396269",
    "tt4912910",
    "tt1371111",
    "tt0107688",
    "tt0096283",
    "tt0113497",
    "tt0363163",
    "tt0298130",
    "tt3521164",
    "tt2948372",
    "tt0120663",
    "tt0395169",
    "tt0360486",
    "tt0119396",
    "tt7784604",
    "tt1951266",
    "tt1650062",
    "tt1065073",
    "tt3799694",
    "tt1748122",
    "tt0496806",
    "tt6791350",
    "tt0047478",
    "tt1320253",
    "tt0790724",
    "tt1646971",
    "tt0077416",
    "tt2106476",
    "tt4649466",
    "tt0878804",
    "tt1231583",
    "tt2798920",
    "tt0910936",
    "tt0117500",
    "tt1403865",
    "tt0100405",
    "tt1104001",
    "tt0389860",
    "tt1041829",
    "tt0822854",
    "tt0212338",
    "tt0368891",
    "tt0433035",
    "tt0120601",
    "tt2788710",
    "tt1179933",
    "tt0100802",
    "tt0887883",
    "tt0213149",
    "tt1193138",
    "tt0462538",
    "tt0167190",
    "tt0064116",
    "tt0071315",
    "tt0238380",
    "tt0110148",
    "tt1707386",
    "tt0053125",
    "tt0209163",
    "tt3731562",
    "tt0120667",
    "tt1306980",
    "tt7653254",
    "tt1790809",
    "tt4881806",
    "tt0163025",
    "tt0359950",
    "tt0125439",
    "tt0116367",
    "tt1037705",
    "tt1591095",
    "tt0884328",
    "tt0970179",
    "tt6857112",
    "tt9362722",
    "tt0112471",
    "tt0399295",
    "tt0094721",
    "tt2322441",
    "tt0386588",
    "tt1951261",
    "tt0031381",
    "tt2771200",
    "tt1645170",
    "tt0056592",
    "tt0119528",
    "tt2109248",
    "tt1638355",
    "tt0413267",
    "tt0119008",
    "tt0381849",
    "tt0944835",
    "tt0472043",
    "tt0190590",
    "tt4975722",
    "tt0094226",
    "tt1981677",
    "tt2004420",
    "tt0129387",
    "tt0332379",
    "tt0175880",
    "tt0399201",
    "tt3682448",
    "tt3606756",
    "tt0453467",
    "tt0414387",
    "tt0103776",
    "tt0425210",
    "tt0105323",
    "tt1245526",
    "tt0109040",
    "tt4925292",
    "tt0489099",
    "tt0212720",
    "tt1764651",
    "tt1397280",
    "tt0119177",
    "tt0457939",
    "tt10366206",
    "tt0293662",
    "tt1125849",
    "tt7888964",
    "tt1152836",
    "tt0103644",
    "tt1790885",
    "tt3110958",
    "tt0298203",
    "tt0118880",
    "tt0119822",
    "tt0449467",
    "tt1197624",
    "tt0838283",
    "tt2140479",
    "tt0278504",
    "tt0120201",
    "tt0106977",
    "tt1598778",
    "tt1194173",
    "tt1253863",
    "tt0814314",
    "tt5727208",
    "tt0120762",
    "tt1302011",
    "tt0112384",
    "tt7991608",
    "tt0120623",
    "tt0265666",
    "tt1028528",
    "tt5311514",
    "tt0056172",
    "tt0320661",
    "tt0319343",
    "tt1013752",
    "tt0808151",
    "tt3076658",
    "tt4034228",
    "tt1478338",
    "tt1028532",
    "tt5726616",
    "tt1485796",
    "tt4123430",
    "tt0379786",
    "tt1091191",
    "tt0077651",
    "tt0095327",
    "tt0473075",
    "tt2397535",
    "tt4550098",
    "tt1735898",
    "tt2316204",
    "tt0800039",
    "tt0120669",
    "tt2277860",
    "tt1259571",
    "tt9114286",
    "tt0203009",
    "tt0077631",
    "tt7349950",
    "tt0783233",
    "tt4160708",
    "tt3065204",
    "tt1213663",
    "tt0121164",
    "tt0463985",
    "tt0120611",
    "tt0089218",
    "tt1133985",
    "tt4263482",
    "tt3263904",
    "tt0322259",
    "tt0258000",
  ];

  // Create the folder if it doesn't exist
  const folderPath = "./data/imdb";
  const imdbFolderExists = await fs
    .stat(folderPath)
    .then(() => true)
    .catch(() => false);
  if (!imdbFolderExists) await fs.mkdir(folderPath);

  for (const id of ids) {
    const path = `${folderPath}/${id}.html`;
    const exists = await fs
      .stat(path)
      .then(() => true)
      .catch(() => false);
    if (exists) continue;
    console.log("downloading", id);
    const body = await fetch(`https://www.imdb.com/title/${id}/plotsummary/`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    }).then((res) => {
      if (res.status !== 200) throw new Error("Failed to download");
      return res.text();
    });
    await fs.writeFile(path, body);
  }

  await vector.remove({
    include: {
      type: "tag",
    },
  });

  for (const tag of data.tags) {
    console.log(`Adding tag ${tag.id}...`);

    await vector.ingest({
      text: tag.text,
      metadata: { type: "tag", id: tag.id },
    });
  }

  let index = 0;
  await queue(25, ids, async (id) => {
    const path = `./data/imdb/${id}.html`;
    const body = await fs.readFile(path);
    const $ = Cheerio.load(body);
    const year = parseInt(
      $("title")
        .text()
        .match(/\((\d+)\)/)?.[1] || "0"
    );
    const title = $("[data-testid=subtitle]").text().trim();
    const summary = $("[data-testid=sub-section-summaries] li:first-child")
      .text()
      .trim();
    console.log("processing", id, title);
    const poster = $("meta[property='og:image']").attr("content")!;

    $("[data-testid=sub-section-synopsis] br").replaceWith("\n");
    const synopsis = $("[data-testid=sub-section-synopsis]")
      .text()
      .split("\n")
      .filter(Boolean);

    await s3.send(
      new PutObjectCommand({
        Bucket: Resource.Assets.bucketName,
        Key: "posters/" + id + ".jpg",
        ContentType: "image/jpeg",
        Body: await fetch(poster).then((res) => res.arrayBuffer() as any),
      })
    );

    await vector.remove({
      include: {
        type: "movie",
        id,
      },
    });
    for (let i = 0; i < synopsis.length; i++) {
      await vector.ingest({
        text: synopsis[i],
        metadata: { type: "movie", id, source: "synopsis", chunk: i },
      });
    }

    const tags = [] as any[];
    for (const tag of data.tags) {
      const ret = await vector.retrieve({
        text: tag.text,
        include: { type: "movie", id },
      });

      if (
        ret.results.length > 0 &&
        ret.results.filter((s: any) => s.score >= 0.79).length > 2
      ) {
        tags.push(tag.id);
      }
    }
    console.log(title, tags, Resource.Movies.tableName);

    await docClient.send(
      new PutCommand({
        TableName: Resource.Movies.tableName,
        Item: {
          id,
          data: JSON.stringify({
            title,
            about: summary,
            synopsis,
            poster: `https://${Resource.Assets.bucketName}.s3.amazonaws.com/posters/${id}.jpg`,
            id,
            tags,
            year,
          }),
        },
      })
    );
    console.log("Finished", ++index);
  });
  return;
}

load()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => {
    console.error(err);
  });
