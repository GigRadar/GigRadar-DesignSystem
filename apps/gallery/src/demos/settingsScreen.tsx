import { color, component, radius, spacing } from '@gigradar/theme';
import {
  AiPromptConfig,
  AiTool,
  IconAgentToolsFill,
  IconAutoReplyBubbleFill,
  IconConnectedPeopleFill,
  IconKeyFill,
  IconLazizaSparkleFill,
  IconNotificationBellFill,
  IconPresetDocumentFill,
  IconPromptTerminalFill,
  SettingsHeader,
  SettingsPanel,
  SettingsSection,
  type SettingsItem,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { AutoReplyDemo, MentionPresetDemo } from './aiConfiguration';
import { AI_TOOLS } from '../fixtures/aiConfiguration';
import { SAMPLE_PROMPT, VARIABLES, VERSIONS } from '../fixtures/prompt';

/**
 * CRM ▸ Settings, assembled from the components that ship it — Figma 3772:2760.
 *
 * The rail is `SettingsPanel`, the head is `SettingsHeader`, each block is a
 * `SettingsSection`, and the four cards inside are `AiPromptConfig`,
 * `MentionPresetList`, `AutoReply` and `AiTool`. Nothing here is redrawn: the
 * screen exists so a proposal can be reviewed in the surface it will live in,
 * and a hand-built copy of that surface would be reviewing the copy.
 */

/** The rail, exactly as CRM ▸ Settings wires it. */
export const SETTINGS_ITEMS: SettingsItem[] = [
  {
    id: 'crm-ai',
    label: 'CRM AI Configuration',
    icon: IconLazizaSparkleFill,
    children: [
      { id: 'prompt', label: 'Prompt', icon: IconPromptTerminalFill },
      { id: 'presets', label: 'Presets', icon: IconPresetDocumentFill },
      { id: 'auto-reply', label: 'Auto Reply', icon: IconAutoReplyBubbleFill },
      { id: 'agent-tools', label: 'AI Tools', icon: IconAgentToolsFill },
    ],
  },
  { id: 'api-key', label: 'Upwork API Key', icon: IconKeyFill },
  { id: 'account', label: 'Upwork Connected Account', icon: IconConnectedPeopleFill },
  { id: 'notifications', label: 'Notifications', icon: IconNotificationBellFill },
];

export type SettingsScreenProps = {
  /**
   * Extra sections, keyed by the shipped section they follow.
   *
   * A proposal under review is drawn where it would actually sit — an account
   * prompt after the team prompt it appends to — rather than at the end, since
   * where a section falls is part of what is being reviewed.
   */
  after?: Partial<Record<'prompt' | 'presets' | 'autoReply' | 'tools', ReactNode>>;
};

/**
 * The whole screen: rail on the left, AI Configuration on the right.
 *
 * Drawn at the Figma frame's proportions — a 300px rail against a flexible
 * pane, both scrolling inside a rounded card — so a section under review is
 * seen at the width and beside the neighbours it will really have.
 */
export function SettingsScreen({ after }: SettingsScreenProps) {
  const [selected, setSelected] = useState('prompt');
  const [versionId, setVersionId] = useState('v2');
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        width: '100%',
        height: 760,
        backgroundColor: color.main.white,
        borderRadius: radius.l,
        border: `1px solid ${color.navbar.hover}`,
        overflow: 'hidden',
      }}
    >
      <SettingsPanel
        items={SETTINGS_ITEMS}
        value={selected}
        onSelect={(item) => setSelected(item.id)}
        title="Settings"
      />

      {/* The pane scrolls on its own, the way the real screen does — the rail
          stays put while the sections move. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          gap: component.settingsSection.stackGap,
          overflowY: 'auto',
        }}
      >
        <SettingsHeader
          title="CRM AI Configuration"
          description="Customize your CRM AI on the go for seamless automation."
          paddingBottom={0}
        />

        <SettingsSection
          title="Custom Prompt"
          description="The instructions Laziza follows on every CRM run. Save your changes to commit a new version, you can restore any earlier version below."
        >
          <AiPromptConfig
            defaultValue={SAMPLE_PROMPT}
            fieldHeight={200}
            variables={VARIABLES}
            versions={VERSIONS}
            versionId={versionId}
            onVersionChange={(version) => setVersionId(version.id)}
            onVersionRestore={(version) => setSaved(`restored ${version.id}`)}
            onVersionDelete={(version) => setSaved(`deleted ${version.id}`)}
            onSave={({ label }) => setSaved(label ? `saved as “${label}”` : 'saved')}
            onReset={() => setSaved('reset to v0')}
            savedHint={saved ?? '4 minutes ago'}
          />
        </SettingsSection>

        {after?.prompt}

        <SettingsSection
          title="Mention Presets"
          description="Reusable @-mention snippets your team can drop into CRM replies. Drag to set priority, the top preset shows first in the mention picker."
        >
          <MentionPresetDemo />
        </SettingsSection>

        {after?.presets}

        <SettingsSection
          title="Auto Reply"
          description="Reply to every message in a thread, or only the first one."
        >
          <AutoReplyDemo />
        </SettingsSection>

        {after?.autoReply}

        <SettingsSection
          title="AI Tools"
          description="Registered capabilities available to Laziza on every CRM run. Reference them by name in your custom prompt above."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, width: '100%' }}>
            {AI_TOOLS.map((tool) => (
              <AiTool key={tool.name} {...tool} />
            ))}
          </div>
        </SettingsSection>

        {after?.tools}

        {/* The screen's sections sit on 32px of bottom room. */}
        <div style={{ height: spacing.xl, flex: '0 0 auto' }} />
      </div>
    </div>
  );
}
