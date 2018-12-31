import axios from 'axios';
import history from '../history';
import { addTopicToCategoryAll, removeTopicFromCategoryAll } from '../store';

/**
 * ACTION TYPES
 */
const REQUEST_USERS = 'REQUEST_USERS';
const RECEIVE_USERS = 'RECEIVE_USERS';

const REQUEST_USER = 'REQUEST_USER';
const RECEIVE_USER = 'RECEIVE_USER';

const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';

const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';

const REMOVE_ACTIVE_USER = 'REMOVE_ACTIVE_USER';

/**
 * ACTION CREATORS
 */
const requestUsers = () => ({ type: REQUEST_USERS });
const receiveUsers = users => ({ type: RECEIVE_USERS, users });

const requestUser = () => ({ type: REQUEST_USER });
const receiveUser = user => ({ type: RECEIVE_USER, user });

const createUserSuccess = user => ({ type: CREATE_USER_SUCCESS, user });
const updateUserSuccess = user => ({ type: UPDATE_USER_SUCCESS, user });
const deleteUserSuccess = userId => ({ type: DELETE_USER_SUCCESS, userId });

export const removeActiveUser = () => ({ type: REMOVE_ACTIVE_USER });

/**
 * THUNK CREATORS
 */
export const fetchUsers = () => async dispatch => {
  dispatch(requestUsers());
  try {
    const { data } = await axios.get('/api/users');
    dispatch(receiveUsers(data || []));
  } catch (error) {
    return dispatch(receiveUsers({ error }));
  }
};

export const fetchUser = userId => async dispatch => {
  dispatch(requestUser());
  try {
    const { data } = await axios.get(`/api/users/${userId}`);
    dispatch(receiveUser(data || {}));
  } catch (err) {
    console.error(err);
  }
};

export const createUser = user => async dispatch => {
  try {
    const { data } = await axios.post(`/api/users`, user);
    dispatch(createUserSuccess(data || {}));
    history.push(`/manage/users/${data.id}`);
  } catch (err) {
    console.error(err);
  }
};

export const updateUser = user => async dispatch => {
  try {
    const { data } = await axios.put(`/api/users/${user.id}`, user);
    dispatch(updateUserSuccess(data || {}));
    history.goBack();
  } catch (err) {
    console.error(err);
  }
};

export const updateUserTopics = topics => async dispatch => {
  try {
    await axios.put(`/api/users/me/topics`, topics);
    // dispatch(me());
    dispatch(removeTopicFromCategoryAll(topics.topicIds));
  } catch (err) {
    console.error(err);
  }
};

export const removeUserTopic = topicId => async dispatch => {
  try {
    const { data } = await axios.delete(`/api/users/me/topics/${topicId}`);
    // dispatch(me());
    dispatch(addTopicToCategoryAll(data || {}));
  } catch (err) {
    console.error(err);
  }
};

export const deleteUser = user => async dispatch => {
  try {
    const { data } = await axios.delete(`/api/users/${user.id}`);
    dispatch(deleteUserSuccess(data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * INITIAL STATE
 */
const initialUsers = {
  isLoading: false,
  active: {},
  all: []
};

/**
 * REDUCERS
 */
export const usersReducer = (state = initialUsers, action) => {
  switch (action.type) {
    case REQUEST_USERS:
    case REQUEST_USER:
      return {
        ...state,
        isLoading: true
      };

    case RECEIVE_USERS:
      return {
        ...state,
        isLoading: false,
        all: action.users
      };

    case RECEIVE_USER:
      return {
        ...state,
        isLoading: false,
        active: action.user
      };

    case CREATE_USER_SUCCESS:
      return {
        ...state,
        all: [...state.all, action.user]
      };

    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        all: [...state.all]
      };

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        all: [...state.all].filter(item => item.id !== action.userId)
      };

    case REMOVE_ACTIVE_USER:
      return {
        ...state,
        active: {}
      };

    default:
      return state;
  }
};
