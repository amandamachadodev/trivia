import React from 'react';
import PropTypes from 'prop-types';
import './rankingStyle.css';
import { getSortedRanking } from '../../Helpers/ranking';

class Ranking extends React.Component {
  renderRanking = () => {
    const ranking = getSortedRanking();
    if (ranking.length === 0) {
      return (
        <p>Conclua o jogo para aparecer aqui.</p>
      );
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Gravatar</th>
            <th>Nome</th>
            <th>Pontuação</th>
          </tr>
        </thead>
        <tbody>
          {
            ranking.map((player, index) => (
              <tr key={ player.name }>
                <td><img src={ player.picture } alt={ player.name } /></td>
                <td data-testid={ `player-name-${index}` }>{player.name}</td>
                <td data-testid={ `player-score-${index}` }>{player.score}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }

  renderHomeButton = () => (
    <button
      type="button"
      onClick={ () => {
        const { history } = this.props;
        history.push('/');
      } }
      data-testid="btn-go-home"
      className="buttonInicio"
    >
      Início
    </button>
  )

  render() {
    return (
      <div className="Ranking">
        <h2 data-testid="ranking-title">Ranking</h2>
        {this.renderRanking()}
        {this.renderHomeButton()}
      </div>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func }).isRequired,
};

export default Ranking;
