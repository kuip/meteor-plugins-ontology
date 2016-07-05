


ChatS = {
  creator: {
    type: 'string',
    label: 'Creator'
  },
  participants: {//array of usernames
    type: '[string]',
    label: 'Participants',
    optional: true
  },
  archived_participants: {
    type: '[string]',
    label: 'Archived Participants',
    optional: true
  },
  patient: {
    type: 'string',
    label: 'Patient'
  }
}

MessageS = {
  message: {
    type: 'string',
    label: 'Message'
  },
  chat: {
    type: 'string',
    label: 'Chat'
  },
  user: {
    type: 'string',
    label: 'User'
  },
  time: {
    type: 'date',
    label: 'Timestamp',
    autoValue: {'MPFunction': 'TimeAuto'}
  }
}


/*
ChatS = {
  creator: {
    type: String,
    label: 'Creator'
  },
  participants: {//array of usernames
    type: [String],
    label: 'Participants',
    optional: true
  },
  archived_participants: {
    type: [String],
    label: 'Archived Participants',
    optional: true
  },
  patient: {
    type: String,
    label: 'Patient'
  }
}

MessageS = {
  message: {
    type: String,
    label: 'Message'
  },
  chat: {
    type: String,
    label: 'Chat'
  },
  user: {
    type: String,
    label: 'User'
  },
  time: {
    type: Date,
    label: 'Timestamp',
    autoValue: function() {
        return new Date();
    }
  }
}
*/