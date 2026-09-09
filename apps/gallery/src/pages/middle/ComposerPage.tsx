import { spacing } from '@gigradar/theme';
import {
  CharacterCount,
  Composer,
  ComposerAttachment,
  ComposerField,
  ComposerStatus,
  ChooseBmButton,
  ComposerButton,
  ComposerIconButton,
  IconAttachmentClip,
  IconBoldFormat,
  IconCodeFormat,
  IconItalicFormat,
  IconMeetingsStroke,
  IconStrikethroughFormat,
  SendButton,
  type TextMark,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Row, Surface } from './parts';

/**
 * A stand-in for an uploaded picture.
 *
 * An inline SVG rather than a file: the gallery has no asset pipeline, and the
 * chip is being shown for its frame and its remove control rather than for
 * whatever photograph happens to be in it.
 */
const SAMPLE_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='72'%3E%3Crect width='64' height='72' fill='%23DCE8FF'/%3E%3C/svg%3E";

/**
 * Mid ▸ Composer — Figma node 1081:12890.
 *
 * The box a message is written in. Its controls are built; the field itself and
 * the assembled composer are still to come, so this page documents the parts
 * that exist and names what does not.
 */
export function ComposerPage() {
  const [mode, setMode] = useState<'message' | 'note'>('message');
  const [draft, setDraft] = useState('');
  const [bmOpen, setBmOpen] = useState(false);
  const [marks, setMarks] = useState<TextMark[]>([]);
  const [files, setFiles] = useState<string[]>([]);

  const toggleMark = (mark: TextMark) =>
    setMarks((current) =>
      current.includes(mark) ? current.filter((m) => m !== mark) : [...current, mark],
    );

  return (
    <>
      <PageHeader
        title="Composer"
        description="The box a message is written in, and the controls around it. Figma node 1081:12890 — eight states."
      />

      <CrossLink
        eyebrow="Related"
        links={[
          { label: 'Components ▸ Main ▸ Button', pageId: 'button' },
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
          { label: 'Mid ▸ Laziza AI', pageId: 'crm-mid-laziza' },
        ]}
      >
        The Message / Note tabs are <strong>ComposerButton</strong>, filed with the buttons because
        they predate this set. Everything else on this page is new.
      </CrossLink>

      <Section
        title="Message and Note"
        description="Which kind of thing is being written. A note is internal — it never reaches the client — which is why the Note tab carries the Laziza spark: the same mark that names AI-written and internal-only content everywhere else."
      >
        <Surface>
          <Row>
            <ComposerButton info selected={mode === 'message'} onClick={() => setMode('message')}>
              Message
            </ComposerButton>
            <ComposerButton laziza info selected={mode === 'note'} onClick={() => setMode('note')}>
              Note
            </ComposerButton>
          </Row>
        </Surface>
        <Caption>Click to switch — they are one choice, so only one fills.</Caption>
        <CodeBlock
          code={`<ComposerButton info selected={mode === 'message'} onClick={…}>Message</ComposerButton>
<ComposerButton laziza info selected={mode === 'note'} onClick={…}>Note</ComposerButton>`}
        />
      </Section>

      <Section
        title="Send and schedule"
        description="One control in two colours: send is the brand blue, schedule the purple that names queued messages everywhere else. `filled` is passed rather than derived from the field — the composer owns the draft, and a button that inspected it would need to know about attachments, mentions, and edits to get the answer right."
      >
        <Surface>
          <Row>
            <SendButton filled={draft.length > 0} onClick={() => setDraft((d) => (d ? '' : 'Hi'))} />
            <SendButton action="schedule" filled={draft.length > 0} onClick={() => setDraft((d) => (d ? '' : 'Hi'))} />
            <SendButton disabled />
            <SendButton action="schedule" disabled />
          </Row>
        </Surface>
        <Caption>
          Click either to toggle the draft state. The last two are disabled — the message cannot be
          sent at all. Hover a filled button to see it deepen to its hover colour: the brand
          #145FC4 for send, the schedule #763BAD for the clock (Figma 99:4596 and 2022:6907).
        </Caption>
        <CodeBlock
          code={`<SendButton filled={hasDraft} onClick={send} />
<SendButton action="schedule" filled={hasDraft} onClick={openScheduler} />`}
        />
      </Section>

      <Section
        title="Choose Business Manager"
        description="Which account the message goes out from. The avatar is the label — which manager is sending is a face people recognise faster than a name, and the pill has to sit in a toolbar beside a text box without taking the room a name would need."
      >
        <Surface>
          <Row>
            <ChooseBmButton
              name="Marina Ovcharenko"
              tone="volcano"
              open={bmOpen}
              onClick={() => setBmOpen((open) => !open)}
            />
          </Row>
        </Surface>
        <Caption>Click to open — the pill outlines and the chevron flips.</Caption>
        <CodeBlock
          code={`<ChooseBmButton name="Marina Ovcharenko" avatar={photo} open={open} onClick={toggle} />`}
        />
      </Section>

      <Section
        title="The toolbar controls"
        description="Attachment, meeting, and the four rich-text marks are one component with different glyphs. Transparent at rest rather than carrying a fill: a row of eight filled discs under a text box would read as a second toolbar competing with the message being written."
      >
        <Surface>
          <Row>
            <ComposerIconButton icon={IconAttachmentClip} label="Attach a file" />
            <ComposerIconButton icon={IconMeetingsStroke} label="Propose a meeting" />
            <span style={{ width: spacing.s }} />
            <ComposerIconButton
              icon={IconBoldFormat}
              label="Bold"
              active={marks.includes('bold')}
              onClick={() => toggleMark('bold')}
            />
            <ComposerIconButton
              icon={IconItalicFormat}
              label="Italic"
              active={marks.includes('italic')}
              onClick={() => toggleMark('italic')}
            />
            <ComposerIconButton
              icon={IconStrikethroughFormat}
              label="Strikethrough"
              active={marks.includes('strike')}
              onClick={() => toggleMark('strike')}
            />
            <ComposerIconButton
              icon={IconCodeFormat}
              label="Code"
              active={marks.includes('code')}
              onClick={() => toggleMark('code')}
            />
          </Row>
        </Surface>
        <Caption>
          Click the marks to toggle them. Hover and active are the same fill — what separates them is
          that active outlives the pointer.
        </Caption>
        <CodeBlock
          code={`<ComposerIconButton icon={IconAttachmentClip} label="Attach a file" onClick={attach} />
<ComposerIconButton icon={IconBoldFormat} label="Bold" active={isBold} onClick={toggleBold} />`}
        />
      </Section>

      <Section
        title="What each control says"
        description="Every control in the row is a glyph in a circle, so each carries a tooltip naming what it does. The four marks go further and give their keyboard shortcut on both platforms — the glyphs are variations on a letterform, and the keystroke is what a writer reaches for once they know which is which."
      >
        <Surface>
          <ComposerField
            marks={marks}
            onMarkToggle={toggleMark}
            maxLength={5000}
            defaultValue="Hover any control under this field."
            onDraftAi={() => undefined}
            onAttach={() => undefined}
            onMeeting={() => undefined}
          />
        </Surface>
        <Caption>
          Hover the marks for their shortcuts, the sparkle for “Draft AI Response”, the clip for
          “Send Attachment”, and the camera for “Propose Meeting”. Clicking a mark previews it on the
          draft — the field holds plain text, so the preview is the whole message rather than a
          selection.
        </Caption>
        <CodeBlock
          code={`<ComposerField
  marks={marks}
  onMarkToggle={toggleMark}
  onDraftAi={draftWithLaziza}
  onAttach={attach}
  onMeeting={proposeMeeting}
/>`}
        />
      </Section>

      <Section
        title="Mobile"
        description="`layout=“mobile”` drops the character count and the rule beside it, and shortens the status badge to its mark. The toolbar carries the same controls in roughly half the width, and the count is the one thing on it that reports rather than does."
      >
        <Surface>
          <div style={{ display: 'flex', gap: spacing.m, alignItems: 'flex-start' }}>
            <div style={{ width: 370 }}>
              <Composer
                layout="mobile"
                onSend={() => undefined}
                field={{
                  marks,
                  onMarkToggle: toggleMark,
                  maxLength: 5000,
                  onDraftAi: () => undefined,
                  onAttach: () => undefined,
                  onMeeting: () => undefined,
                }}
              />
            </div>
          </div>
        </Surface>
        <Caption>
          The badge keeps its wording for a screen reader — an open eye alone does not say “visible
          to all participants”.
        </Caption>
        <CodeBlock code={`<Composer layout="mobile" onSend={send} field={field} />`} />
      </Section>

      <Section
        title="The status badge"
        description="What the composer is about to do — stated as a consequence rather than as a mode. The tabs above already say which mode is chosen; what the writer needs before pressing send is who ends up reading it, and that is the one thing a mode name does not tell them. Each takes the colour it carries elsewhere."
      >
        <Surface>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, alignItems: 'flex-start' }}
          >
            <ComposerStatus mode="message" />
            <ComposerStatus mode="note" />
            <ComposerStatus mode="schedule" />
            <ComposerStatus mode="edit" />
          </div>
        </Surface>
        <CodeBlock code={`<ComposerStatus mode="note" />`} />
      </Section>

      <Section
        title="The character counter"
        description="Drawn as a pill rather than bare text so it holds its shape as the number grows — a count that shifted the toolbar every thousand characters would be worse than no count at all. At the limit the text goes black and drops its dimming; that is the only state change, because the count is ambient until it becomes the reason a message cannot be sent."
      >
        <Surface>
          <Row>
            <CharacterCount value={0} />
            <CharacterCount value={87} />
            <CharacterCount value={4999} />
            <CharacterCount value={5000} />
          </Row>
        </Surface>
        <Caption>The last is at the limit.</Caption>
        <CodeBlock code={`<CharacterCount value={draft.length} max={5000} />`} />
      </Section>

      <Section
        title="Attachments"
        description="Figma files the image and the file as separate components; they are one chip here. A picture is its own label so it carries no name, a file has nothing to show so it carries one, and both stand 72px — a row mixing them reads as one strip rather than as two kinds of thing."
      >
        <Surface>
          <Row>
            <ComposerAttachment src={SAMPLE_IMAGE} name="Screenshot.png" onRemove={() => undefined} />
            <ComposerAttachment name="File names" type="PDF" onRemove={() => undefined} />
            <ComposerAttachment src={SAMPLE_IMAGE} name="Uploading.png" uploading />
            <ComposerAttachment name="Draft Design.pdf" type="PDF" uploading />
          </Row>
        </Surface>
        <Caption>
          Hover either for the remove control — it appears on hover rather than sitting there, since
          an attachment about to be sent is the normal case and a permanent cross reads as a warning.
        </Caption>
        <CodeBlock
          code={`<ComposerAttachment src={preview} name="Screenshot.png" onRemove={remove} />
<ComposerAttachment name="Draft Design.pdf" type="PDF" uploading />
<ComposerAttachment name="Draft Design.pdf" type="PDF" onRemove={remove} />`}
        />
      </Section>

      <Section
        title="The field"
        description="A real `<textarea>` rather than a contenteditable div: the draft is plain text with marks applied to a selection, and every accessibility and IME behaviour a contenteditable would reimplement already works here. The toolbar is drawn from what is passed — no `marks`, no rich-text controls; no `maxLength`, no counter."
      >
        <Surface>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
            <ComposerField
              marks={[]}
              maxLength={5000}
              onAttach={() => undefined}
              onMeeting={() => undefined}
              onDraftAi={() => undefined}
            />
            <ComposerField value="Hi" marks={['bold']} maxLength={5000} onAttach={() => undefined} />
            <ComposerField value="" error />
            <ComposerField value="" disabled marks={[]} maxLength={5000} />
          </div>
        </Surface>
        <Caption>
          Empty, filled with a mark applied, error, and disabled. Error drops the toolbar — there is
          nothing to format while the message is being rejected.
        </Caption>
        <CodeBlock
          code={`<ComposerField
  value={draft}
  onValueChange={setDraft}
  marks={marks}
  onMarkToggle={toggleMark}
  maxLength={5000}
  onAttach={attach}
/>`}
        />
      </Section>

      <Section
        title="Attaching a file"
        description="The tray is not a state the composer is put into — it exists only once something is in it. The clip opens the browser's own file chooser, the composer keeps what comes back, and an empty list leaves no strip padding the field out."
      >
        <Surface>
          <Composer
            hasDraft={files.length > 0}
            onSend={() => setFiles([])}
            field={{
              marks: [],
              maxLength: 5000,
              accept: 'image/*,.pdf',
              onAttach: (picked) =>
                setFiles((current) => [...current, ...Array.from(picked).map((f) => f.name)]),
              attachments: files.map((name, i) => (
                <ComposerAttachment
                  key={`${name}-${i}`}
                  name={name}
                  type={name.split('.').pop()?.toUpperCase()}
                  onRemove={() => setFiles((current) => current.filter((_, j) => j !== i))}
                />
              )),
            }}
          />
        </Surface>
        <Caption>
          {files.length === 0
            ? 'No attachments — press the clip and choose a file.'
            : `${files.length} attached. Hover a chip to remove it, or press send to clear.`}
        </Caption>
        <CodeBlock
          code={`const [files, setFiles] = useState<File[]>([]);

<Composer
  field={{
    accept: 'image/*,.pdf',
    onAttach: (picked) => setFiles((c) => [...c, ...Array.from(picked)]),
    attachments: files.map((file, i) => (
      <ComposerAttachment key={i} name={file.name} onRemove={() => remove(i)} />
    )),
  }}
/>`}
        />
      </Section>

      <Section
        title="Note mode"
        description="A note never leaves the team, so the two controls that act on the client have nothing to act on: there is no one to meet, and nothing to queue for sending. Both are dropped rather than disabled — a disabled schedule button would imply the note could be scheduled once something else was true."
      >
        <Surface>
          <Composer
            mode="note"
            onModeChange={setMode}
            onSend={() => undefined}
            onSchedule={() => undefined}
            field={{ marks: [], maxLength: 5000, onAttach: () => undefined, onMeeting: () => undefined }}
          />
        </Surface>
        <Caption>
          Compare with Message above: the camera and the schedule button are gone, and the status
          badge reads “Private to members of your team”.
        </Caption>
      </Section>

      <Section
        title="Assembled"
        description="Figma's eight states are two things enumerated together: which mode the composer is in, and what the room happens to be doing. Built as `mode` plus the field's own state plus an optional `banner`, they compose — so “a scheduled note that failed to send” is a combination rather than a ninth variant nobody drew."
      >
        <Surface>
          <Composer
            mode={mode}
            onModeChange={setMode}
            hasDraft={draft.length > 0}
            chooseBm={{ name: 'Marina Ovcharenko', tone: 'volcano' }}
            onSend={() => undefined}
            onSchedule={() => undefined}
            field={{
              value: draft,
              onValueChange: setDraft,
              marks,
              onMarkToggle: (mark) => toggleMark(mark),
              maxLength: 5000,
              onAttach: () => undefined,
              onMeeting: () => undefined,
            }}
          />
        </Surface>
        <Caption>
          Type to fill the send button, switch tabs to change the status badge, and toggle the marks.
        </Caption>
        <CodeBlock
          code={`<Composer
  mode={mode}
  onModeChange={setMode}
  hasDraft={draft.length > 0 || attachments.length > 0}
  chooseBm={{ name: manager.name, avatar: manager.photo }}
  onSend={send}
  onSchedule={openScheduler}
  field={{ value: draft, onValueChange: setDraft, maxLength: 5000, onAttach: attach }}
/>`}
        />
      </Section>

      <Section
        title="Still to build"
        description="Three of Figma's eight states depend on things outside the composer and are passed in as a `banner` rather than built: Trial / Basic, BM Not in this room, and 1st Loading."
      >
        <Caption>
          The remaining five — Comment, Message, [EDIT] Message, Scheduled, and Error — are the
          `mode` and field states above.
        </Caption>
      </Section>
    </>
  );
}
