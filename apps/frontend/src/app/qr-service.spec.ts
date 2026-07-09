import { QrService } from "./qr-service";

describe('QrService', () => {
  const service = new QrService();

  const testTriples: [string, boolean, string][] = [
    ['https://80-jahre-bergrettung.at/tickets/activate?ticketId=123e4567-e89b-12d3-a456-426614174000', true, 'valid url'],
    ['https://80-jahre-bergrettung.at/tickets/activate?ticketId=123e4567-e89b-12d3-a456-42661417400', false, 'too short guid'],
    ['https://80-jahre-bergrettung.at/tickets/activate?ticketId=123e4567-e89b-12d3-a456-4266141740000', false, 'too long guid'],

    ['https://80-jahre-bergrettung.de/tickets/activate?ticketId=123e4567-e89b-12d3-a456-42661417400g', false, 'wrong tld'],
    ['https://80-jahre-bergrettung.at/activate?ticketId=123e4567-e89b-12d3-a456-426614174000', false, 'wrong url path'],
    ['https://api.80-jahre-bergrettung.at/activate?ticketId=123e4567-e89b-12d3-a456-426614174000', false, 'wrong subdomain'],
  ];

  for (const [urlUnderTest, expectedResult] of testTriples) {
    it('test validation', () => {
      expect(service.validateQrCodeContent(urlUnderTest)).toBe(expectedResult);
    });
  }
});
