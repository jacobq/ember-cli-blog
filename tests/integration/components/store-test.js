import { next } from '@ember/runloop';
import { module, test,
//  skip
} from 'qunit';
//import { pauseTest } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | service | store', function(hooks) {
  setupRenderingTest(hooks);

  let store;
  hooks.beforeEach(function() {
    store = this.owner.lookup('service:store');
  });

  async function nukePosts() {
    // Nuke any pre-existing posts
    return await store.findAll('post').then(posts => Promise.all(posts.map(p => p.destroyRecord())));
  }

  async function nukePostsAndWait() {
    await nukePosts();
    return new Promise((resolve) => next(resolve));
  }

  async function createPost() {
    return await store.createRecord('post').save();
  }

  function destroyPost(id) {
    return store.findRecord('post', id).then(post => post.destroyRecord());
  }

  async function waitThenDestroyPost(id) {
    await new Promise((resolve) => next(resolve));
    return await destroyPost(id);
  }

  test('Create + delete (single)', async function(assert) {
    await nukePostsAndWait();

    const createdPost = await createPost();
    const post = await store.find('post', createdPost.get('id'));
    await post.destroyRecord();
    assert.equal(store.peekAll('post').get('length'), 0);
  });

  test('Create + delete (all) !!! FAILING !!!', async function(assert) {
    await nukePostsAndWait();

    await createPost();
    const posts = await store.findAll('post');
    await Promise.all(posts.map(p => p.destroyRecord()));
    assert.equal(store.peekAll('post').get('length'), 0);
  });

  test('Create + delete (all)', async function(assert) {
    await nukePostsAndWait();

    const createdPost = await createPost();
    await destroyPost(createdPost.get('id'));
    assert.equal(store.peekAll('post').get('length'), 0);
  });

  test('Create + wait + delete (all)', async function(assert) {
    await nukePosts();

    const createdPost = await createPost();
    await waitThenDestroyPost(createdPost.get('id'));
    assert.equal(store.peekAll('post').get('length'), 0);
  });
});
