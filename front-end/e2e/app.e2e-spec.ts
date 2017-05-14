import { AjandaPage } from './app.po';

describe('ajanda App', () => {
  let page: AjandaPage;

  beforeEach(() => {
    page = new AjandaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
