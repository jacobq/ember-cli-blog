import { module, test } from 'qunit';
import {
  click,
  currentURL,
  find,
  fillIn,
// pauseTest,
  settled,
  visit,
  waitFor,
} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | post', function(hooks) {
  setupApplicationTest(hooks);

  test('Create + delete', async function(assert) {
    await visit('/');

    // 1. Click "Create" to start editing a new post
    const createBtn = find('[data-test-id="create-post-button"]');
    await click(createBtn);

    // 2. Enter a name for the post
    const nameInputSelector = '[data-test-id="post-title-input-wrapper"] input';
    await waitFor(nameInputSelector, 2*1000); // Seems this isn't part of the previous click's "settling"
    await fillIn(nameInputSelector, 'Name of post');

    // 3. Click "Done" to save
    const doneBtn = find('[data-test-id="done-editing-post-button"]');
    await click(doneBtn);

    // 4. Click "Edit" to go back to editing
    const editBtn = find('[data-test-id="edit-post-button"]');
    await click(editBtn);

    // 5. Click "Delete" to delete the post
    const deleteBtn = find('[data-test-id="delete-post-button"]');
    await click(deleteBtn);

    await settled();
    assert.equal(currentURL(), '/posts');
  });
});
