import { getClient } from '../services/contentfulClient';

export default class Model {
  constructor(props) {
    this.props = props;
  }
  Home = () => '../data/articles.json';
  Article = slag => `../data/${slag}.json`;

  static loadPost = (slug, loadType) => (
    new Promise((resolve) => {
      getClient().getEntries({
        content_type: 'post',
        order: '-sys.createdAt',
        'fields.slug': slug || '',
        include: 3,
      }).then((payload) => {
        if (!payload.items.length) {
          throw new Error('Entry not found');
        }

        const time = payload.items[0].sys.createdAt;

        if (loadType !== 'posts') {
          Model.loadNextPost(time).then((data) => {
            if (data) payload.items.push(data);
            resolve(payload.items);
          });
        } else {
          resolve(payload.items);
        }
      });
    })
  )

  static loadNextPost = time => (
    new Promise((resolve) => {
      getClient().getEntries({
        limit: 1,
        content_type: 'post',
        order: '-sys.createdAt',
        'sys.createdAt[lt]': time,
      }).then((payload) => {
        resolve(payload.items[0]);
      }).catch(console.error);
    })
  )
}
