import { QrService } from "./qr-service";

describe('QrService', () => {
  const service = new QrService();

  const testTriples: [string, boolean, string][] = [
    ['https://80-jahre-bergrettung.at/tickets/activate?code=abcdef', true, 'valid url'],
    ['https://80-jahre-bergrettung.at/tickets/activate?code=abcde', false, 'too short guid'],
    ['https://80-jahre-bergrettung.at/tickets/activate?code=abcdefg', false, 'too long guid'],

    ['https://80-jahre-bergrettung.de/tickets/activate?code=abcdef', false, 'wrong tld'],
    ['https://80-jahre-bergrettung.at/activate?code=abcdef', false, 'wrong url path'],
    ['https://api.80-jahre-bergrettung.at/activate?code=abcdef', false, 'wrong subdomain'],
  ];

  for (const [urlUnderTest, expectedResult] of testTriples) {
    it('test validation', () => {
      expect(service.validateQrCodeContent(urlUnderTest)).toBe(expectedResult);
    });
  }
});
