import { getSessionDescription, summarize } from './app';

describe('html-api-redirect', () => {
  describe('getSessionDescription', () => {
    it('전체 flow', async () => {
      const result = await getSessionDescription(
        'https://www.devinflearn.com',
        548,
      );

      expect(result).toContain('3년 차 서버 개발자입니다');
    });
  });

  describe('summarize', () => {
    it('152자 이하면 그대로 반환한다', () => {
      const result = summarize(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta?',
      );

      expect(result).toHaveLength(125);
    });

    it('152자 이상이면 152자로 줄인다', () => {
      const result = summarize(
        'constructora asedqwd asdasdas qweqw 1qsasdasdas Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nonne merninisti licere mihi ista probare, quae sunt a te dicta?',
      );

      expect(result).toHaveLength(152);
    });

    it('html 태그를 escape한다', () => {
      const result = summarize('<script>alert("hello")</script>');

      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });
  });
});
