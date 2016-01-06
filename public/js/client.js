var socket = undefined;

var ActBox = React.createClass({
	render: function() {
		console.log('ActBox.render() called.');
		return (
			<div className="actBox">
			<ActList />
			</div>
		)
	}
});
var ActList = React.createClass({
	getInitialState: function() {
		return {
			acts: []
		}
	},
	componentDidMount: function() {
		socket = io.connect('http://localhost:3000/');
		socket.on('error', function (error) {
		  console.log('Error on socket', error);
		});
		socket.on('refreshActs', function(data) {
			console.log('refreshActs', data);
			this.setState(data);
		}.bind(this));
	},
	render: function() {
		console.log('ActList.render() called.');
		var actNodes = this.state.acts.map(function(act) {
			return (
				<Act act={act} key={act.time} />
			)
		});
		return (
			<div className="actList">
			<h1>Acts</h1>
			{actNodes}
			</div>
		);
}
});
var Act = React.createClass({
	render: function () {
		return (
			<div className="act">
			{this.props.act.time} - {this.props.act.type} - {this.props.act.state}
			</div>
		)
	}
});
var ActForm = React.createClass({
	render: function () {}
});

ReactDOM.render(
	<ActBox/>,
  document.getElementById('content')
);
