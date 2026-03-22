---
title: "Store patterns in Svelte: Gitlab's Vuex"
pubDate: 2020-09-03
duration: "15 min"
category: "Svelte"
---
When your JS project gets big you often end up needing a data store. With larger apps or SPA's this can get complex really quick. When working with Vue I usually use [Gitlab's Vuex Frontend Development Guidelines](https://docs.gitlab.com/ee/development/fe_guide/vuex.html). A guide that aims to provide structure and order when working with Vuex, Vue.js' store.

For more technical web projects/apps I've switched to Svelte. It allows for more versatility, flexibility, makes my technical project more maintainable and reduces development time.

Another great thing about Svelte are it's stores but they can quickly become chaotic if you don't apply any structure. In order to provide some guidelines I decided to port Gitlab's Vuex examples to Svelte's stores.

Here is the result:

<iframe title="Gitlab's Vuex guide for Svelte" src="https://svelte.dev/repl/939579262de34b00b97873f2e61cd3b0?version=3.19.2" width="100%" height="600px" scrolling="no"></iframe>

## Gitlab's philosophy

One of the main goals of their style is to steer you towards proper application design:

> The first thing you should do before writing any code is to design the state.

Another main aspect of their method is to work with a *useful* separation of concerns:

> When a user clicks on an action, we need to dispatch it. This action will commit a mutation that will change the state.

Grounded in a no-BS real world-based approach:

> Remember that actions only describe that something happened, they don’t describe how the application state changes.

With very **concrete** advice, for example their super solid [Action naming](https://docs.gitlab.com/ee/development/fe_guide/vuex.html#actions-pattern-request-and-receive-namespaces) guidelines:

> 1. An action requestSomething, to toggle the loading state
> 2. An action receiveSomethingSuccess, to handle the success callback
> 3. An action receiveSomethingError, to handle the error callback
> 4. An action fetchSomething to make the request.

I f you have ever used Vue I highly recommend you read [Gitlab guide itself](https://docs.gitlab.com/ee/development/fe_guide/vuex.html) for some context.

## The Store actions
Since Gitlab *exclusively* uses actions to interface with the store (very sensible) you'll find all the "exposed" functions here.

> Never commit a mutation directly from a component

You can find the entire code here but we'll cut some stuff out to make it a bit more readable so you can scroll past this one

```js
  import * as types from './mutation_types';
  import axios from '~/lib/utils/axios_utils';
  import createFlash from '~/flash';

  export const requestUsers = ({ commit }) => commit(types.REQUEST_USERS);
  export const receiveUsersSuccess = ({ commit }, data) => commit(types.RECEIVE_USERS_SUCCESS, data);
  export const receiveUsersError = ({ commit }, error) => commit(types.RECEIVE_USERS_ERROR, error);

  export const fetchUsers = ({ state, dispatch }) => {
    dispatch('requestUsers');

    axios.get(state.endpoint)
      .then(({ data }) => dispatch('receiveUsersSuccess', data))
      .catch((error) => {
        dispatch('receiveUsersError', error)
        createFlash('There was an error')
      });
  }

  export const requestAddUser = ({ commit }) => commit(types.REQUEST_ADD_USER);
  export const receiveAddUserSuccess = ({ commit }, data) => commit(types.RECEIVE_ADD_USER_SUCCESS, data);
  export const receiveAddUserError = ({ commit }, error) => commit(types.REQUEST_ADD_USER_ERROR, error);

  export const addUser = ({ state, dispatch }, user) => {
    dispatch('requestAddUser');

    axios.post(state.endpoint, user)
      .then(({ data }) => dispatch('receiveAddUserSuccess', data))
      .catch((error) => dispatch('receiveAddUserError', error));
  }
```

Most of Gitlab's state mutations have a basic/simple corresponding action which is used to trigger the mutation. Subsequently they use these to create bigger and more useful "service" actions that they use in the application.

At some point I'll make the code a bit more succinct than I would normally do to improve readability. Furthermore I'll temporarily remove the `addUser` function. It doesn't significantly differ from `fetchUsers` and reduces the LOC you have to scan through by 50%.

```js
  import * as types from './mutation_types';
  import axios from '~/lib/utils/axios_utils';
  import createFlash from '~/flash';

  export const fetchUsers = ({ state, commit, dispatch }) => {
    commit(types.REQUEST_USERS)

    axios.get(state.endpoint)
      .then(({ data }) => commit(types.RECEIVE_USERS_SUCCESS, data))
      .catch((error) => {
        commit(types.RECEIVE_USERS_ERROR, error)
        createFlash('There was an error')
      });
  }
```
I've you've ever worked with finite state machines this might kinda remind you of them, essentially the following is happening:

1. The function `fetchUsers` is executed from a component.
2. `REQUEST_USERS` is committed to the store.
3. The API request is made.
4. On succes or error respectively `RECEIVE_USERS_SUCCESS` and `RECEIVE_USERS_ERROR` are committed passing along the relevant data.

Let's see what these commits do. I've excluded the other commits:

```js
 export default {
    [types.REQUEST_USERS](state) {
      state.isLoading = true;
    },
    [types.RECEIVE_USERS_SUCCESS](state, data) {
      // Do any needed data transformation to the received payload here
      state.users = data;
      state.isLoading = false;
    },
    [types.RECEIVE_USERS_ERROR](state, error) {
      state.isLoading = false;
    }
 };

```
In the first commit the loading state is activated, this is done before making the actual request.

Using the second or third request the loading state is deactivated and the data is processed or the error handled depending on whether the request was successfully.

Pretty straightforward right? Finally, the state. Since it's quite small I'm including it in it's entirety here:


``` js
export default () => ({
	endpoint: null,
	
	isLoading: false,
	error: null,
	
	isAddingUser: false,
	errorAddingUser: false,
	
	users: [],
});

```

## Porting the Vue example to Svelte

Ok that was a lot of Vuex code, let's move it to Svelte.

It's easiest to explain these stores from high-level to low-level and to design them the other way around. So we'll do the state first:

``` js
import { writable } from 'svelte'

export const endpoint = null

export const isLoading 					= writable(false)
export const error     					= writable(null)

export const isAddingUser				= writable(false)
export const errorAddingUser			= writable(false)

export const users						= writable([])
```
I'm using a `const` variable for the endpoint since it's not going to change (one of the first subtle signs of Svelte's flexibility).

Svelte's [writables](https://svelte.dev/docs#writable) are its default store mechanisms. Besides `writable` you've got `readable` and `derived` (which would be a getter in Vuex).

<!--What I love about this way of defining state is that it's way more flexible, customisable and it works much better with Typescript.-->

Let's add some actions:

```js
import { writable } from 'svelte'

export const endpoint 					= 'https://api.openbrewerydb.org/breweries'

export const isLoading 					= writable(false)
export const error     					= writable(null)

export const isAddingUser				= writable(false)
export const errorAddingUser			= writable(false)

export const users				  		= writable([])

export const requestUsers = () => isLoading.set(true)
export const receiveUsersSuccess = (data) => {
	// Do any needed data transformation to the received payload here
	users.set(data)
	isLoading.set(false)
}
export const receiveUsersError = (error) => {
	// handle error
	isLoading.set(false)
}
```
I'm a big fan of keeping these two in the same file since it encourages me to keep the store "modules" small and simple but separate them if you want.

We will be importing the store variables to use in our components but not the functions that mutate the store data, we'll use these *only* in our "actions". I like to call them services and separate them in `store` (state & state mutations) and `service` (actions) folders.

```js
import { endpoint, requestUsers, receiveUsersSuccess, receiveUsersError } from './store'
import createFlash from '~/flash'

export const fetchUsers = () => {
    requestUsers()

    axios.get(endpoint)
      .then(({ data }) => receiveUsersSuccess(data))
      .catch((error) => {
        receiveUsersError(error)
        createFlash('There was an error')
      });
  }
```

The `requestUsers` name looks a bit weird like this, I personally would rename this to be clearer but apart from this we're done! You can check out the working example [here](https://svelte.dev/repl/939579262de34b00b97873f2e61cd3b0?version=3.19.2) which includes a basic UI to interact with the store and service.

## Final thoughts

Some things from the GL guide are not useful in Svelte. Due to svelte stores just being regular JS/TS and them being imported like this there is no need for separate mutation types.

> Use mutation types instead of hardcoding strings. It will be less error prone.

In this case Svelte is less error prone by default.