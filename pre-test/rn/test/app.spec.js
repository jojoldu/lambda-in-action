import { getData, main } from '../app';

describe('React Native App', () => {
  describe('main', () => {
    //event.queryStringParameters.videoId
    const fixture = {
      queryStringParameters: {
        videoId: 1,
      },
    };

    it('videoId가 없으면 전체 데이터를 반환한다', () => {
      const result = main({
        queryStringParameters: {},
      });

      expect(result.statusCode).toBe(200);
      expect(result.body).toContain('videos');
      expect(JSON.parse(result.body).videos).toHaveLength(100);
    });

    it('videoId가 있으면 해당 video를 반환한다', () => {
      const result = main(fixture);

      expect(result.statusCode).toBe(200);
      expect(result.body).toContain('video');
      expect(JSON.parse(result.body).video.id).toBe(1);
    });

    it('videoId가 숫자가 아니면 400을 반환한다', () => {
      const result = main({
        queryStringParameters: {
          videoId: 'a',
        },
      });

      expect(result.statusCode).toBe(400);
      expect(result.body).toContain('id는 정수만 가능합니다');
    });
  });

  it('getData', () => {
    const data = getData();

    expect(data).toHaveLength(100);
  });
});
