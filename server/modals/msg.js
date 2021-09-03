const generateMessage = ({ from, message = null, to, link = null } = {}) => {
  const time = new Date();

  const hour = time
    .toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase();

  return {
    from,
    message,
    link,
    to,
    createdAt: hour,
  };
};

module.exports = generateMessage;
