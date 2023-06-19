export const data = getList();

export function main(event) {
  const queryStringParameters = event.queryStringParameters;

  if (!queryStringParameters) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        videos: paginate(data, 10, 1),
      }),
    };
  }

  if (
    queryStringParameters.videoId &&
    queryStringParameters.pageNo &&
    queryStringParameters.pageSize
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'videoId, pageNo, pageSize는 동시에 사용할 수 없습니다.',
      }),
    };
  }

  if (queryStringParameters.pageNo && queryStringParameters.pageSize) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        videos: paginate(
          data,
          Number(queryStringParameters.pageSize),
          Number(queryStringParameters.pageNo),
        ),
      }),
    };
  }

  return getOne(queryStringParameters);
}

function getOne(queryStringParameters) {
  const param = queryStringParameters.videoId;

  if (isNaN(param) || !Number.isInteger(parseFloat(param))) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'id는 정수만 가능합니다.',
      }),
    };
  }

  const videoId = Number(queryStringParameters.videoId);

  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        video: data[videoId - 1],
      }),
    };
  } catch (e) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        video: {},
      }),
    };
  }
}

export function getList() {
  return getUrls().map((url, index) => ({
    id: 100 - index,
    title: `제목 ${100 - index}`,
    description: `영상 소개 ${100 - index}`,
    uploader: `업로더 ${100 - index}`,
    uploadedAt: getDate(),
    url,
  }));
}

export function getDate() {
  const randomDate = getRandomDate();

  return formatDate(randomDate);
}

function formatDate(date) {
  const pad = (n) => (n < 10 ? '0' + n : n);

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    ' ' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds())
  );
}

function getRandomDate() {
  const start = new Date(2020, 0, 1);
  const end = new Date();

  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

function paginate(array, pageSize = 10, pageNo = 1) {
  const pageIndex = pageNo - 1;

  try {
    return array.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  } catch (e) {
    console.log(
      `paginate 에서 에러 발생, pageSize=${pageSize}, pageNo=${pageNo}`,
      e,
    );

    return [];
  }
}

function getUrls() {
  return [
    'https://cdn.inflab.com/vod/031dc22b-2054-47ea-9cdf-11ac3194c15b.mp4',
    'https://cdn.inflab.com/vod/06dd4779-2536-44da-9428-3e59edbb4c30.mp4',
    'https://cdn.inflab.com/vod/0811cf22-8ee0-42db-a5fe-c152db56c70d.mp4',
    'https://cdn.inflab.com/vod/08700898-f669-4a76-9cbb-8eaa3a0ff8a2.mp4',
    'https://cdn.inflab.com/vod/09aec0c7-f6f7-49e8-9315-beb1163739db.mp4',
    'https://cdn.inflab.com/vod/0d512e92-8c38-41c0-8082-1a7b71e571cb.mp4',
    'https://cdn.inflab.com/vod/0d8d9f54-7213-409a-a9b2-931ed2d80791.mp4',
    'https://cdn.inflab.com/vod/0de9ded4-b53a-47a1-9c51-0d0577985bf3.mp4',
    'https://cdn.inflab.com/vod/10ab1f9d-8dcf-4d26-9753-c1202d5628a2.mp4',
    'https://cdn.inflab.com/vod/14154853-9bc6-4082-8d62-10bac592e9c4.mp4',
    'https://cdn.inflab.com/vod/14416978-4e48-4eee-b6fb-4a98c48d4a5b.mp4',
    'https://cdn.inflab.com/vod/1690249c-49e1-466b-8f07-2ce05afd2b4a.mp4',
    'https://cdn.inflab.com/vod/16eabdde-fa9e-4d80-b69b-723e150878be.mp4',
    'https://cdn.inflab.com/vod/1b473983-dc38-4f01-a9b7-4da276585c66.mp4',
    'https://cdn.inflab.com/vod/1be15504-7ed9-45d2-ba76-372cbb85ef47.mp4',
    'https://cdn.inflab.com/vod/1cef1102-cd54-428e-842d-f957788491f1.mp4',
    'https://cdn.inflab.com/vod/1d7643bd-73c8-4b35-a870-a8c726847aff.mp4',
    'https://cdn.inflab.com/vod/21b99485-51f2-4357-b062-53bcac933b90.mp4',
    'https://cdn.inflab.com/vod/22eac3ef-f2d6-44f2-9b1f-bfbd8ade5369.mp4',
    'https://cdn.inflab.com/vod/23c242f9-7302-4180-8988-a547e519dfab.mp4',
    'https://cdn.inflab.com/vod/251bb6a2-99bd-4af1-bd12-c50bb6292250.mp4',
    'https://cdn.inflab.com/vod/26c9695e-b277-4a63-9e1b-9768a5cc5965.mp4',
    'https://cdn.inflab.com/vod/2a93978b-d8a1-40b2-a7db-01d4c635e551.mp4',
    'https://cdn.inflab.com/vod/2ce13bff-158c-4f01-b52b-b4d6235ab2a2.mp4',
    'https://cdn.inflab.com/vod/2e0f2743-096c-414f-ad2d-3c9ced49bddf.mp4',
    'https://cdn.inflab.com/vod/31437b5d-160a-433e-85bc-8638d763f127.mp4',
    'https://cdn.inflab.com/vod/36007f27-bc2c-426f-82db-0731a8211e65.mp4',
    'https://cdn.inflab.com/vod/37222e5b-3e5b-460f-8755-def7a3f7e3bf.mp4',
    'https://cdn.inflab.com/vod/38317b50-b841-434e-83bc-a5e4f0e38337.mp4',
    'https://cdn.inflab.com/vod/39ff07a8-137f-401b-8940-63d026834b7f.mp4',
    'https://cdn.inflab.com/vod/3c5cba20-5ec7-428c-9930-88e3b8a3cd1f.mp4',
    'https://cdn.inflab.com/vod/43f23ec7-ca14-4c75-aacd-35d937e739fa.mp4',
    'https://cdn.inflab.com/vod/468255ba-1cfc-4175-9e00-c26a58c9f3aa.mp4',
    'https://cdn.inflab.com/vod/4a445058-7cac-4bc1-a2a2-82449aab16e1.mp4',
    'https://cdn.inflab.com/vod/4a63ef38-009a-4ff2-a242-36c618b6ae64.mp4',
    'https://cdn.inflab.com/vod/4b783481-7d30-4bf0-94d7-fc737b029c32.mp4',
    'https://cdn.inflab.com/vod/4dc3898d-2447-42ca-981e-4883068b0ce0.mp4',
    'https://cdn.inflab.com/vod/4de24261-d9cb-42cc-b2ae-3cd58352db0b.mp4',
    'https://cdn.inflab.com/vod/4eb5db79-88bc-4aa7-a881-4199d9d5355e.mp4',
    'https://cdn.inflab.com/vod/508fae09-e81a-4583-9627-07edf39834a9.mp4',
    'https://cdn.inflab.com/vod/51133cd8-3fa1-43c1-807b-68043d3f0151.mp4',
    'https://cdn.inflab.com/vod/524de517-f75d-4eeb-a9d3-5ff82f981e67.mp4',
    'https://cdn.inflab.com/vod/55913472-a6ac-40d2-94fc-44dfda1d404c.mp4',
    'https://cdn.inflab.com/vod/58ca929f-041a-4147-bc12-f65271398b90.mp4',
    'https://cdn.inflab.com/vod/5aed8965-9d46-4ad8-a166-06cedf8c4ee0.mp4',
    'https://cdn.inflab.com/vod/5b9ec82d-a4e6-449e-a5bf-e73be951a1de.mp4',
    'https://cdn.inflab.com/vod/5e6b34d0-319d-4ed7-8679-6876da8fd00d.mp4',
    'https://cdn.inflab.com/vod/5ee315ab-4a54-46a2-aafb-4fbb9a350457.mp4',
    'https://cdn.inflab.com/vod/62639083-c981-4c88-bd11-81f79cab9346.mp4',
    'https://cdn.inflab.com/vod/67de56cf-aa36-4d9e-82d6-0e63420e1e6a.mp4',
    'https://cdn.inflab.com/vod/6b970d39-af91-431a-b222-6abd33c7909e.mp4',
    'https://cdn.inflab.com/vod/6dc4e3ef-ac0c-451e-88e6-5e0a3fa15327.mp4',
    'https://cdn.inflab.com/vod/76cb6f5e-0fa5-4cdf-947b-66fd4b074bb3.mp4',
    'https://cdn.inflab.com/vod/78d244b2-a083-4f0d-8808-b6f0b425dd4e.mp4',
    'https://cdn.inflab.com/vod/798f49af-dc22-4c04-a1d2-1693fe6c5f12.mp4',
    'https://cdn.inflab.com/vod/79dbb486-368b-4445-bc75-4f3b90983432.mp4',
    'https://cdn.inflab.com/vod/7bce993d-adfe-4e3c-b298-3b82f02e5ea6.mp4',
    'https://cdn.inflab.com/vod/83b9aaf4-50fa-426b-a95e-29b3cd1c542d.mp4',
    'https://cdn.inflab.com/vod/89c3284d-1392-4bec-a301-2657a4acf3df.mp4',
    'https://cdn.inflab.com/vod/8ae04d8b-2125-4d6a-a107-8ef8fa921663.mp4',
    'https://cdn.inflab.com/vod/8ef5b49b-9c0b-41f6-be1e-4162fb54ebf4.mp4',
    'https://cdn.inflab.com/vod/950a91de-7564-404c-b43d-31d03cc710c6.mp4',
    'https://cdn.inflab.com/vod/96e19426-2d27-4cf6-823b-6cefdc7b3f7e.mp4',
    'https://cdn.inflab.com/vod/9853026b-683d-4e56-b6f6-cc88ea20dbc5.mp4',
    'https://cdn.inflab.com/vod/9d2d815e-7864-4d18-a4f7-3ff945280cc6.mp4',
    'https://cdn.inflab.com/vod/a6cca2c2-50ba-4c07-a895-a961351f7f45.mp4',
    'https://cdn.inflab.com/vod/a89c83b9-43b7-4918-bd60-8c97b43e7bae.mp4',
    'https://cdn.inflab.com/vod/aa6e3ff6-a64c-474a-9fee-e56a68a6230a.mp4',
    'https://cdn.inflab.com/vod/acf54800-fd74-4628-a39f-07d23e9ee0ad.mp4',
    'https://cdn.inflab.com/vod/adf3d761-0c21-43d5-ab83-effdb79e74ae.mp4',
    'https://cdn.inflab.com/vod/aed4844c-16da-4131-8151-b21ff6fdc521.mp4',
    'https://cdn.inflab.com/vod/af1793f4-d63d-4a1e-b634-3d9077db9a12.mp4',
    'https://cdn.inflab.com/vod/b5b428dd-8f30-4fe9-bce3-9b7cfaa7d73b.mp4',
    'https://cdn.inflab.com/vod/b79a0587-9d37-49cc-8f24-64b2099b3490.mp4',
    'https://cdn.inflab.com/vod/b7edc7e1-3c51-4c2f-888f-13ca93bd4aa4.mp4',
    'https://cdn.inflab.com/vod/b8a6ae7a-c1b4-4b0a-acc6-21b7044c7220.mp4',
    'https://cdn.inflab.com/vod/b9c01bc8-fa85-45bb-865e-07d5bae3dea3.mp4',
    'https://cdn.inflab.com/vod/c2a7e7c0-6a8d-4f3e-9dd2-608ca52ffd41.mp4',
    'https://cdn.inflab.com/vod/c553af9d-201a-406c-b249-df73d8167fae.mp4',
    'https://cdn.inflab.com/vod/c8c7d9ab-6866-4bd5-b8b7-38de828e45ba.mp4',
    'https://cdn.inflab.com/vod/caa6446a-ace8-45e2-b2b4-f72b28eabe3c.mp4',
    'https://cdn.inflab.com/vod/cd36103d-7853-48e2-8070-d62ca9f477ba.mp4',
    'https://cdn.inflab.com/vod/cdca3f83-f463-49d3-abd2-7c9f79b3d180.mp4',
    'https://cdn.inflab.com/vod/d067f76a-62e9-46f3-9269-959d4d86a945.mp4',
    'https://cdn.inflab.com/vod/d4fd785c-567d-472c-8f16-bbcaf71ccd25.mp4',
    'https://cdn.inflab.com/vod/d8baefe5-851d-4c78-a1cb-80513979cfdc.mp4',
    'https://cdn.inflab.com/vod/daba4c68-0543-4412-9573-8e0905f83aa2.mp4',
    'https://cdn.inflab.com/vod/dd957bad-0e66-4284-b9ad-1ab24b2846c0.mp4',
    'https://cdn.inflab.com/vod/decb3b6f-522e-48d6-af41-7003078af904.mp4',
    'https://cdn.inflab.com/vod/df4d9418-9aa8-4a55-b065-7b7498316988.mp4',
    'https://cdn.inflab.com/vod/e3abd180-b67c-48ba-a541-7feb5ca2be25.mp4',
    'https://cdn.inflab.com/vod/e6638b05-2581-479d-bdaf-ed46a5b38dd8.mp4',
    'https://cdn.inflab.com/vod/e694e3be-e5e1-426a-adf4-31af305ffdc1.mp4',
    'https://cdn.inflab.com/vod/e8810425-d2dc-46f2-a593-011e618ccce5.mp4',
    'https://cdn.inflab.com/vod/e9132987-8a48-4548-9d17-25959143e941.mp4',
    'https://cdn.inflab.com/vod/ee833681-f03f-4f3e-a1d6-6803f64383ca.mp4',
    'https://cdn.inflab.com/vod/ef37200c-d34f-4ee9-9598-f96a960b0da0.mp4',
    'https://cdn.inflab.com/vod/f874f72f-577c-4c76-8871-5aea7dc39063.mp4',
    'https://cdn.inflab.com/vod/f8c64b4c-14dc-4e6e-b11b-979bacf4d66d.mp4',
    'https://cdn.inflab.com/vod/fb84ecce-a7a4-41a0-b910-f1dcc327b10f.mp4',
  ];
}
