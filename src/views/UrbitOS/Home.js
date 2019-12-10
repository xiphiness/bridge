import React, { useCallback, useState } from 'react';
import { Grid, Button, SelectInput } from 'indigo-react';
import * as ob from 'urbit-ob';
import { azimuth } from 'azimuth-js';

import { usePointCursor } from 'store/pointCursor';
import { usePointCache } from 'store/pointCache';

import useCurrentPointName from 'lib/useCurrentPointName';
import useKeyfileGenerator from 'lib/useKeyfileGenerator';
import * as need from 'lib/need';

import {
  OutButton,
  ForwardButton,
  BootUrbitOSButton,
} from 'components/Buttons';
import CopyButton from 'components/CopyButton';
import NetworkingKeys from 'components/NetworkingKeys';

import BridgeForm from 'form/BridgeForm';
import { useLocalRouter } from 'lib/LocalRouter';

export default function UrbitOSHome() {
  const { pointCursor } = usePointCursor();
  const { getDetails } = usePointCache();

  const { push, names } = useLocalRouter();

  const point = need.point(pointCursor);
  const details = need.details(getDetails(point));

  const sponsor = ob.patp(details.sponsor);

  const { code, notice } = useKeyfileGenerator();

  const [showKeys, setShowKeys] = useState(false);

  const showSponsor = azimuth.getPointSize(point) !== azimuth.PointSize.Galaxy;
  const toggleShowKeys = useCallback(() => setShowKeys(!showKeys), [
    setShowKeys,
    showKeys,
  ]);

  const goNetworkingKeys = useCallback(() => push(names.NETWORKING_KEYS), [
    names,
    push,
  ]);

  const goChangeSponsor = useCallback(() => push(names.CHANGE_SPONSOR), [
    push,
    names,
  ]);
  return (
    <>
      <Grid>
        <Grid.Item full className="mv7">
          Urbit OS
        </Grid.Item>
        <Grid.Divider />
        <Grid.Item full as={BootUrbitOSButton} />
      </Grid>

      <Grid>
        <Grid.Item full className="mv7 f5">
          Network
        </Grid.Item>
        <Grid.Divider />
        {showSponsor && (
          <>
            <Grid.Item
              full
              as={ForwardButton}
              detail="A sponsor finds new peers in your network"
              accessory={<u>Change</u>}
              onClick={goChangeSponsor}>
              <span className="mono">{sponsor}</span>
              <span className="f7 bg-black white p1 ml2 r4">SPONSOR</span>
            </Grid.Item>
            <Grid.Divider />
          </>
        )}
        <Grid.Item
          full
          as={ForwardButton}
          accessory={code && <CopyButton text={code} />}
          detail={code || notice}
          disabled={!code}
          detailClassName="mono">
          Login Code
        </Grid.Item>
        <Grid.Divider />
        <Grid.Item full as={ForwardButton} onClick={goNetworkingKeys}>
          Reset Networking Keys
        </Grid.Item>
        <Grid.Divider />
        <Grid.Item
          full
          as={ForwardButton}
          accessory={showKeys ? '▲' : '▼'}
          onClick={toggleShowKeys}>
          View Networking Keys
        </Grid.Item>
        {showKeys && <Grid.Item full as={NetworkingKeys} point={point} />}
      </Grid>
    </>
  );
}

// eslint-disable-next-line
function Hosting() {
  const name = useCurrentPointName();
  const options = [{ text: 'Tlon', value: 'tlon' }];

  const props = { name, options };
  const connected = false;

  return (
    <Grid gap={4}>
      <Grid.Item full className="f5">
        Urbit OS
      </Grid.Item>

      {(connected && <HostingConnected {...props} />) || (
        <HostingDisconnected {...props} />
      )}
    </Grid>
  );
}

function HostingConnected({ name, options }) {
  return (
    <BridgeForm initialValues={{ provider: 'tlon' }}>
      {() => (
        <>
          <Grid.Item full>Status: Connected</Grid.Item>
          <Grid.Item cols={[1, 9]} className="gray4">
            <span className="mono">{name}</span> is connected to Tlon and has
            the IP address 127.0.0.1
          </Grid.Item>
          <Grid.Item cols={[1, 9]} as={OutButton} solid success>
            Open OS
          </Grid.Item>
          <Grid.Item cols={[9, 13]} as={Button} className="b-black b1" center>
            Disconnect
          </Grid.Item>
          <Grid.Item
            full
            as={SelectInput}
            name="provider"
            label="Host Provider"
            options={options}
            disabled
          />
        </>
      )}
    </BridgeForm>
  );
}

function HostingDisconnected({ options }) {
  return (
    <BridgeForm initialValues={{ provider: 'tlon' }}>
      {() => (
        <>
          <Grid.Item full className="gray4">
            <span className="gray3">Status:</span> Disconnected
            <br />
            <span className="f6">Last connected: 4m ago</span>
          </Grid.Item>

          <Grid.Item full as={ForwardButton} solid>
            Connect
          </Grid.Item>

          <Grid.Item
            full
            as={SelectInput}
            name="provider"
            label="Host Provider"
            options={options}
            disabled
          />
        </>
      )}
    </BridgeForm>
  );
}