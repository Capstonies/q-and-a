import React from 'react';
import { connect } from 'react-redux';
import { Header, NothingHere } from '../../components';

const MyTopics = ({ topics, isLoading }) => {
  if (isLoading) return null;
  return (
    <div className="box">
      <Header title="Currently Learning" />
      {topics.length > 0 ? (
        topics.map(topic => <h1 key={topic.id}>{topic.name}</h1>)
      ) : (
        <NothingHere />
      )}
    </div>
  );
};

const mapState = state => ({
  topics: state.me.topics,
  isLoading: state.categories.isLoading
});

export default connect(mapState)(MyTopics);
