import React from 'react';
import { azimuth } from 'azimuth-js';
import * as need from '../../lib/need';

import { ETH_ZERO_ADDR, CURVE_ZERO_ADDR, eqAddr } from '../../lib/wallet';
import { Row, Col, H2, P } from '../../components/Base';
import { Button } from '../../components/Base';
import { ROUTE_NAMES } from '../../lib/routeNames';
import { useHistory } from '../../store/history';
import { useWallet } from '../../store/wallet';

const isPlanet = point =>
  azimuth.getPointSize(point) === azimuth.PointSize.Planet;
const isStar = point => azimuth.getPointSize(point) === azimuth.PointSize.Star;

function Actions(props) {
  const history = useHistory();
  const { wallet } = useWallet();
  const { online, point, pointDetails, invites } = props;

  const addr = need.address({ wallet });

  const planet = isPlanet(point);
  const star = isStar(point);

  const isOwner = pointDetails.matchWith({
    Nothing: _ => false,
    Just: details => eqAddr(details.value.owner, addr),
  });
  const isActive = pointDetails.matchWith({
    Nothing: _ => false,
    Just: details => details.value.active,
  });
  const isActiveOwner = isOwner && isActive;
  const canSetSpawnProxy = isActiveOwner && !planet;
  const canSetManagementProxy = isActiveOwner;

  const canManage =
    isOwner ||
    pointDetails.matchWith({
      Nothing: _ => false,
      Just: details => eqAddr(details.value.managementProxy, addr),
    });
  const canConfigureKeys = canManage && isActive;

  const canIssueChild = pointDetails.matchWith({
    Nothing: () => false,
    Just: details => {
      const hasPermission = isOwner || eqAddr(details.value.spawnProxy, addr);

      const isBooted = details.value.keyRevisionNumber > 0;

      const isNotPlanet = !isPlanet(point);

      return hasPermission && isBooted && isNotPlanet;
    },
  });

  const hasInvites = invites.matchWith({
    Nothing: () => false,
    Just: count => count.value > 0,
  });

  const canTransfer = pointDetails.matchWith({
    Nothing: () => false,
    Just: deets =>
      eqAddr(deets.value.transferProxy, addr) ||
      eqAddr(deets.value.owner, addr),
  });

  const canGenKeyfile = pointDetails.matchWith({
    Nothing: () => false,
    Just: deets => {
      const hasPermission =
        eqAddr(deets.value.owner, addr) ||
        eqAddr(deets.value.managementProxy, addr);

      const isBooted = deets.value.keyRevisionNumber > 0;

      return hasPermission && isBooted;
    },
  });

  const canAcceptTransfer = pointDetails.matchWith({
    Nothing: () => false,
    Just: deets => eqAddr(deets.value.transferProxy, addr),
  });

  const canCancelTransfer = pointDetails.matchWith({
    Nothing: () => false,
    Just: deets =>
      eqAddr(deets.value.owner, addr) &&
      !eqAddr(deets.value.transferProxy, ETH_ZERO_ADDR),
  });

  const displayReminder = pointDetails.matchWith({
    Nothing: () => false,
    Just: deets => {
      return (
        deets.value.encryptionKey === CURVE_ZERO_ADDR &&
        deets.value.authenticationKey === CURVE_ZERO_ADDR
      );
    },
  });

  let inviteAction = null;
  if (planet) {
    inviteAction = (
      <Button
        disabled={!isActiveOwner || !online || !hasInvites}
        prop-size={'sm'}
        prop-type={'link'}
        onClick={() => history.push(ROUTE_NAMES.INVITES_SEND)}>
        {'Send invites ('}
        {invites.matchWith({
          Nothing: () => '?',
          Just: count => count.value,
        })}
        {')'}
      </Button>
    );
  }
  if (star) {
    inviteAction = (
      <Button
        disabled={!(isActiveOwner && canIssueChild) || !online}
        prop-size={'sm'}
        prop-type={'link'}
        onClick={() => {
          history.push(ROUTE_NAMES.INVITES_MANAGE);
        }}>
        {'Manage invites'}
      </Button>
    );
  }

  return (
    <div>
      <H2>{'Actions'}</H2>
      {displayReminder ? (
        <P>{`Before you can issue child points or generate your Arvo
                  keyfile, you need to set your public keys.`}</P>
      ) : (
        ''
      )}
      <Row>
        <Col className={'flex flex-column items-start col-md-4'}>
          <Button
            prop-size={'sm'}
            prop-type={'link'}
            disabled={(online || planet) && !canIssueChild}
            onClick={() => {
              history.push(ROUTE_NAMES.ISSUE_CHILD);
            }}>
            {'Issue child'}
          </Button>

          <Button
            prop-size={'sm'}
            prop-type={'link'}
            disabled={online && !canAcceptTransfer}
            onClick={() => {
              history.push(ROUTE_NAMES.ACCEPT_TRANSFER);
            }}>
            {'Accept incoming transfer'}
          </Button>

          <Button
            prop-size={'sm'}
            prop-type={'link'}
            disabled={online && !canCancelTransfer}
            onClick={() => {
              history.push(ROUTE_NAMES.CANCEL_TRANSFER);
            }}>
            {'Cancel outgoing transfer'}
          </Button>

          <Button
            prop-size={'sm'}
            prop-type={'link'}
            disabled={online && !canGenKeyfile}
            onClick={() => {
              history.push(ROUTE_NAMES.GEN_KEYFILE);
            }}>
            {'Generate Arvo keyfile'}
          </Button>
        </Col>
        <Col className={'flex flex-column items-start col-md-4'}>
          <Button
            disabled={online && !canSetSpawnProxy}
            prop-size={'sm'}
            prop-type={'link'}
            onClick={() => {
              history.push(ROUTE_NAMES.SET_SPAWN_PROXY);
            }}>
            {'Change spawn proxy'}
          </Button>

          <Button
            disabled={online && !canSetManagementProxy}
            prop-size={'sm'}
            prop-type={'link'}
            onClick={() => {
              history.push(ROUTE_NAMES.SET_MANAGEMENT_PROXY);
            }}>
            {'Change management proxy'}
          </Button>

          <Button
            disabled={online && !canConfigureKeys}
            prop-size={'sm'}
            prop-type={'link'}
            onClick={() => {
              history.push(ROUTE_NAMES.SET_KEYS);
            }}>
            {'Set network keys'}
          </Button>

          <Button
            disabled={online && !canTransfer}
            prop-size={'sm'}
            prop-type={'link'}
            onClick={() => {
              history.push(ROUTE_NAMES.TRANSFER);
            }}>
            {'Transfer'}
          </Button>
        </Col>
        <Col className={'flex flex-column items-start col-md-4'}>
          {inviteAction}
        </Col>
      </Row>
    </div>
  );
}

export default Actions;
