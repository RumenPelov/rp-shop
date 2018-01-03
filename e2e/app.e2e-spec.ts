import { MongomartPage } from './app.po';

describe('mongomart App', function() {
  let page: MongomartPage;

  beforeEach(() => {
    page = new MongomartPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
