import DefaultPage from './DefaultPage';

export default class Article extends DefaultPage {
  constructor($view, options) {
    super($view);

    this.$view = $view;
    this.options = options;

    this.render();
  }

  events() {}

  destroy() {
    super.destroy();
  }

  render() {
    this.events();
  }
}

// Component.Article = Article;
