import Route from '@ember/routing/route';
import NotFoundError from 'test-app/utils/errors/not-found';

export default Route.extend({
  beforeModel() {
    throw new NotFoundError();
  },
});
