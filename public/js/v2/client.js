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

    this.socket = io(normalizeUrl(document.location.href));
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

ReactDOM.render(
  <ScheduleBox/>,
  document.getElementById('content')
);
