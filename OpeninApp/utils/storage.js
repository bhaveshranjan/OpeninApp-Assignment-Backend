let taskId = null;

const setTaskId = (id) => {
  taskId = id;
};

const getTaskId = () => taskId;

module.exports = { setTaskId, getTaskId };