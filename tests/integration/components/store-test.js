import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | service | store', function(hooks) {
  setupRenderingTest(hooks);

  test('Create + delete', async function(assert) {
    const store = this.owner.lookup('service:store');
    await store.createRecord('post').save();
    const posts = await store.findAll('post');
    await Promise.all(posts.map(p => p.destroyRecord()));
    assert.equal(store.peekAll('post').get('length'), 0);
  });
});
