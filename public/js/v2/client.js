// For compatibility with act* components
// TODO remove it
var socket;

var ScheduleBox = React.createClass({
  getInitialState: function () {
    return {
      active: 0
    };
  },
  componentDidMount: function () {
    function normalizeUrl(uri) {
      var parser = document.createElement('a');
      parser.href = uri;
      var out = parser.hostname;
      if (parser.port != '80') {
        out += ':' + parser.port;
      }
      return out;
    }

    socket = this.socket = io(normalizeUrl(document.location.href));
    this.socket.on('disconnect', function () {
      console.log('disconnect fired.');
    });
    this.socket.on('connect', function () {
      console.log('connect fired.');

    });
    this.socket.on('error', function (error) {
      console.error(error);
    });

    /*
    var scheduleBox = this;
    setInterval(function () {
      console.log(scheduleBox.state);
    }, 2000);
    */
  },
  componentWillUnmount: function () {
    this.socket.close();
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
          <ActForm />
          <ActList />
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

var ActList = React.createClass({
  getInitialState: function () {
    return {
      acts: []
    }
  },
  componentDidMount: function () {
    var actList = this;

    setTimeout(function () {
      socket.on('refreshActs', function (data) {
        actList.setState(data);
      });

      socket.emit('reqRefreshActs');
    }, 1000);

  },
  render: function () {
    var actNodes = this.state.acts
      .map(function (act) {
        return (
          <Act act={act} key={act.id}/>
        )
      });
    return (
      <div className="actList">
        <h3>Недавние активности</h3>
        {actNodes}
      </div>
    );
  }
});
var Act = React.createClass({
  getInitialState: function () {
    var now = moment();
    return {
      'act.finish.date': now.format('YYYY-MM-DD'),
      'act.finish.time': now.format('HH:mm')
    };
  },
  componentDidMount: function () {
    var self = this;
    var datetimeInterval = setInterval(function () {
      var now = moment();
      self.setState({
        'act.finish.date': now.format('YYYY-MM-DD'),
        'act.finish.time': now.format('HH:mm')
      });
    }, 2 * 60 * 1000);

    self.setState({
      datetimeInterval: datetimeInterval
    });
  },
  componentWillUnmount: function () {
    clearInterval(this.state.datetimeInterval);
  },
  handleTimeChange: function (e) {
    this.setState({
      'act.finish.time': e.target.value
    });
  },
  handleFinish: function (e) {
    e.preventDefault();
    var id = this.props.act.id;
    var self = this;
    socket.emit('finishAct', {
      act: {
        id: id,
        finish: {
          date: self.state["act.finish.date"],
          time: self.state["act.finish.time"]
        }
      }
    });
  },
  handleDelete: function (e) {
    e.preventDefault();
    var id = this.props.act.id;
    socket.emit('deleteAct', {
      act: {
        id: id
      }
    });
  },
  render: function () {
    // TODO Remove ternary operator when data is consistent
    var topProperties = [
      <div className="col-md-2 col-xs-4" key="date">{this.props.act.start.date}</div>
    ];
    if (this.props.act.finish) {
      topProperties.push(
        <div className="col-md-6 col-xs-6" key="time">
          {this.props.act.start.time} - {this.props.act.finish.time}
        </div>
      )
    } else {
      topProperties.push(
        <div className="col-md-6 col-xs-6" key="time">
          {this.props.act.start.time} -
          <input
            type="time"
            className="form-control"
            value={this.state["act.finish.time"]}
            onChange={this.handleTimeChange}
          />
        </div>
      )
    }
    if (!this.props.act.finish) {
      topProperties.push(
        <div className="col-md-1 col-xs-2" key="button">
          <input
            type="submit"
            className="btn btn-primary btn-block btn-xs"
            value="F"/>
        </div>
      );
    }
    var topLine = <div className="row">
      <div id="equalheight">
        {topProperties}
      </div>
    </div>;

    var bottomProperties = [
      <div className="col-md-2 col-xs-4" key="type">{this.props.act.type}</div>
    ];
    if (this.props.act.comment) {
      bottomProperties.push(
        <div className="col-md-6 col-xs-6 light" key="comment">{this.props.act.comment}</div>
      );
    }
    ;
    bottomProperties.push(
      <div className="col-md-1 col-xs-2" key="button">
        <input
          type="submit"
          className="btn btn-primary btn-block btn-xs"
          value="D"/>
      </div>
    );

    var bottomLine = <div className="row">
      {bottomProperties}
    </div>;

    return (
      <div className="act">
        <form className="actForm" onSubmit={this.handleFinish}>
          {topLine}
        </form>
        <form className="actForm" onSubmit={this.handleDelete}>
          {bottomLine}
        </form>
        <hr/>
      </div>
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
