import React, { useCallback } from 'react';
import cn from 'classnames';
import * as ob from 'urbit-ob';
import { Grid, H4, Text, LinkButton } from 'indigo-react';

import useWasGreeted from 'lib/useWasGreeted';

const TEXT_STYLE = 'f5';

export default function ActivateDisclaimer({ point }) {
  const [wasGreeted, setWasGreeted] = useWasGreeted();

  const pointName = ob.patp(point);

  const dismiss = useCallback(async () => {
    setWasGreeted(true);
  }, [setWasGreeted]);

  return (
    !wasGreeted && (
      <Grid gap={4} className="mb10">
        <Grid.Item full>
          <Text className={cn(TEXT_STYLE, 'block mb4')}>
            Welcome <code>{pointName}</code>,
          </Text>

          <Text className={cn(TEXT_STYLE, 'block mb2')}>
            As of this very moment, you own an Urbit identity – a digital identity that you can keep for the rest of your life. Use the Master Ticket included in your Passport to access your Urbit identity at any time. Right now you can:
          </Text>
        </Grid.Item>

        <Grid.Item full as={LinkButton} onClick={dismiss}>
          <Text className={cn(TEXT_STYLE, 'block mb2 yellow-dark')}>
            Invite your friends
          </Text>
        </Grid.Item>

        <Grid.Item full as={LinkButton} onClick={dismiss}>
          <Text className={cn(TEXT_STYLE, 'block mb2')}>
            Boot your computer
          </Text>
        </Grid.Item>

        <Grid.Item full>
          <Text className={cn(TEXT_STYLE, 'block mb4')}>
            Welcome to Urbit. See you online.
          </Text>
        </Grid.Item>
        <Grid.Item full as={LinkButton} onClick={dismiss}>
          Close
        </Grid.Item>
      </Grid>
    )
  );
}
