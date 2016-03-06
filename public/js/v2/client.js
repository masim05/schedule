function normalizeUrl(uri) {
  var parser = document.createElement('a');
  parser.href = uri;
  var out = parser.hostname;
  if (parser.port != '80') {
    out += ':' + parser.port;
  }
  return out;
}

var socket = io(normalizeUrl(document.location.href));
socket.on('disconnect', function () {
  console.log('disconnect fired.');
});
socket.on('connect', function () {
  console.log('connect fired.');

});
socket.on('error', function (error) {
  console.error(error);
});

var ScheduleBox = React.createClass({
  getInitialState: function () {
    return {
      active: 0
    };
  },
  componentWillUnmount: function () {
    socket.close();
  },
  render: function () {
    var scheduleBox = this;
    var menuItems = [
      {name: 'Acts', href: '/acts'},
      {name: 'Stats', href: '/stats'}
    ];
    var node;
    if (scheduleBox.state.active) {
      node = (
        <div>
          1111111
        </div>
      );
    } else {
      node = (
        <div>
          <ActForm/>
        </div>
      );
    }
    return (
      <div className="schedule-box">
        <div className="page-header">
          <h1>Baby scheduler v0.1.1</h1>
        </div>
        <div id="main-menu" className="navbar navbar-default" role="navigation">
          <div className="container-fluid">
            <div className="collapse navbar-collapse navbar-menubuilder">
              <MainMenuItems items={menuItems} active={scheduleBox.state.active} parent={scheduleBox}/>
            </div>
          </div>
        </div>
        {node}
      </div>
    )
  }
});

var MainMenuItems = React.createClass({
  getInitialState: function () {
    return {
      active: this.props.active
    };
  },
  handleMenuItemClick: function (index) {
    var mainMenuItems = this;

    return function (e) {
      e.preventDefault();

      mainMenuItems.props.parent.setState({
        active: index
      });

      mainMenuItems.setState({
        active: index
      });
    };
  },
  render: function () {
    var mainMenuItems = this;

    var items = this.props.items.map(function (item, index) {
      var className = '';
      if (index == mainMenuItems.state.active) {
        className = 'active';
      }
      return (
        <li className={className} key={index}>
          <a
            onClick={mainMenuItems.handleMenuItemClick(index, mainMenuItems.props)}
            href={item.href}>
            {item.name}
          </a>
        </li>
      )
    });

    return (
      <ul className="nav navbar-nav navbar-left">
        {items}
      </ul>
    )
  }
});

var ActForm = React.createClass({
  getInitialState: function () {
    var now = moment();

    return {
      'act.start.date': now.format('YYYY-MM-DD'),
      'act.start.time': now.format('HH:mm'),
      'act.type': 'Сон',
      'act.comment': ''
    };
  },
  componentDidMount: function () {
    var self = this;
    var datetimeInterval = setInterval(function () {
      var now = moment();
      self.setState({
        'act.start.date': now.format('YYYY-MM-DD'),
        'act.start.time': now.format('HH:mm')
      });
    }, 2 * 60 * 1000);

    self.setState({
      datetimeInterval: datetimeInterval
    });
  },
  componentWillUnmount: function () {
    clearInterval(this.state.datetimeInterval);
  },
  handleDateChange: function (e) {
    this.setState({
      'act.start.date': e.target.value
    });
  },
  handleTimeChange: function (e) {
    this.setState({
      'act.start.time': e.target.value
    });
  },
  handleTypeChange: function (e) {
    this.setState({
      'act.type': e.target.value
    });
  },
  handleCommentChange: function (e) {
    this.setState({
      'act.comment': e.target.value
    });
  },
  handleSubmit: function (e) {
    e.preventDefault();
    if (!this.state['act.start.date'] || !this.state['act.start.time'] || !this.state['act.type']) {
      return;
    }
    socket.emit('createAct', {
      act: {
        start: {
          date: this.state['act.start.date'],
          time: this.state['act.start.time']
        },
        type: this.state['act.type'],
        comment: this.state['act.comment']
      }
    });

    var now = moment();
    this.setState({
      'act.start.date': now.format('YYYY-MM-DD'),
      'act.start.time': now.format('HH:mm'),
      'act.type': 'Сон',
      'act.comment': ''
    });
  },
  render: function () {
    var self = this;
    var typeNodes = ['Сон', 'Кормление', 'Активное бодрствование'].map(function (type, id) {
      return (
        <label
          htmlFor={'type-' + id}
          className={"btn btn-primary" + (self.state["act.type"] == type ? ' active' : '')}
          key={id}>
          {type}
          <input type="radio" name="type" className="hidden" value={type} id={'type-' + id}
                 checked={self.state["act.type"] == type} onChange={self.handleTypeChange}/>
        </label>
      )
    });
    return (
      <form className="actForm" onSubmit={this.handleSubmit}>
        <h3>Новая активность</h3>
        Дата:
        <input
          type="date"
          className="form-control"
          value={this.state["act.start.date"]}
          onChange={this.handleDateChange}
        />
        <br/>
        Время:
        <input
          type="time"
          className="form-control"
          value={this.state["act.start.time"]}
          onChange={this.handleTimeChange}
        />
        <br/>

        Занятие:<br/>
        <div className="btn-group" data-toggle="buttons">
          {typeNodes}
        </div>
        <br/><br/>

        Комментарий:
        <input
          type="text"
          className="form-control"
          value={this.state["act.comment"]}
          onChange={this.handleCommentChange}
        />
        <br/>
        <input
          type="submit"
          className="btn btn-lg btn-primary btn-block"
          value="Начать"/>
      </form>
    )
  }
});

ReactDOM.render(
  <ScheduleBox/>,
  document.getElementById('content')
);
