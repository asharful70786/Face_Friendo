import Session from "../Models/sessionModel.js";

export const createSessionAndSetCookie = async (userId, res) => {
  const session = await Session.create({ userId });

  const userSessions = await Session.find({ userId });

  if (userSessions.length > 2) {
    const oldest = userSessions[0];
    await Session.deleteOne({ _id: oldest._id });
  }

  //  localhost 
  // res.cookie("sid", session._id.toString(), {
  //   httpOnly: true,
  //   signed: true,
  //   secure: false,
  //   sameSite: "lax",
  //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  // });
  //  ashraful.in
  res.cookie("sid", session._id.toString(), {
    httpOnly: true,
    secure: true,
    domain: '.ashraful.in',
    signed: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return session;
};

