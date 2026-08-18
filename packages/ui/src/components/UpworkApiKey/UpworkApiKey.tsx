import { borderWidth, color, component, typography } from "@gigradar/theme";
import {
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { len, type CssLength } from "../../internal/length.js";
import type { RenderProp, WithDefaultRender } from "../../internal/render.js";
import {
  IconClientIdPeopleStroke,
  IconSecretKeyShieldStroke,
} from "../../icons/defs.js";
import { Button } from "../Button/Button.js";
import { Skeleton } from "../Skeleton/Skeleton.js";
import { SettingsHeader } from "../SettingsSection/SettingsHeader.js";
import { TextField } from "../Field/TextField.js";
import { ApiStatus, type ApiStatusProps } from "./ApiStatus.js";
import { RentApiBanner, type RentApiBannerProps } from "./RentApiBanner.js";
import { TestStatus, type TestStatusTone } from "./TestStatus.js";
import { ViewGuide, type ViewGuideProps } from "./ViewGuide.js";

const { upworkApiKey, upworkAccounts } = component;
const { form } = upworkApiKey;

/** Per-instance overrides for the screen's own metrics. */
export type UpworkApiKeyStyleProps = {
  /** The left column's width. */
  formWidth?: CssLength;
  /** Space between the blocks stacked in the left column. */
  sectionGap?: CssLength;
  /** The right column's fill. */
  sideBackground?: string;
};

/**
 * Which columns to draw.
 *
 * Mirrors `UpworkColumns` on the connected-accounts screen rather than
 * inventing a second vocabulary for the same idea: both screens are the same
 * two-column shell, and a reader who has met one should not have to learn a
 * new name for its halves.
 *
 * Each column is a coherent unit on its own — the credential form and the
 * reference cards are documented and reviewed separately — and rendering one
 * of them should not mean rendering the other and cropping it.
 */
export type ApiKeyColumns = "both" | "form" | "side";

/** One of the four numbered rows in the right column. */
export type SetupStep = {
  /** What to do. */
  title: ReactNode;
  /** The line under it. */
  description: ReactNode;
  /**
   * Draws the description in brand blue, marking it as the step that leaves
   * GigRadar. Figma highlights only the first.
   */
  highlighted?: boolean;
};

/** What the credential form gets when a caller replaces it. */
export type ApiKeyFormRenderProps = WithDefaultRender;

/** What the right column gets when a caller replaces it. */
export type ApiKeySideRenderProps = WithDefaultRender & {
  steps: SetupStep[];
};

export type UpworkApiKeyProps = {
  /**
   * Which columns to draw.
   *
   * @default 'both'
   */
  show?: ApiKeyColumns;
  /** The screen's title. */
  title?: ReactNode;
  /** The line under it. */
  description?: ReactNode;
  /** Shows a back chevron, and fires when it is pressed. */
  onBack?: () => void;

  /** The Client ID field's value. */
  clientId?: string;
  /** Fires as the Client ID is typed. */
  onClientIdChange?: (value: string) => void;
  /** The Secret Key field's value. */
  secretKey?: string;
  /** Fires as the Secret Key is typed. */
  onSecretKeyChange?: (value: string) => void;

  /**
   * The result strip under the form. Omit to hide it.
   *
   * Drives the action row too: while `testing`, both buttons go inert, since
   * the key cannot be saved until the test it is running comes back.
   */
  testTone?: TestStatusTone;
  /** Overrides the result strip's message. */
  testMessage?: ReactNode;

  /** Fires when Test Key is pressed. */
  onTest?: () => void;
  /** Fires when Save Key is pressed. */
  onSave?: () => void;
  /**
   * Enables Save Key.
   *
   * Separate from the field values because saving an untested key is a product
   * decision, not a form-validity one — Figma draws both buttons disabled
   * until a test has come back.
   */
  canSave?: boolean;
  /** Enables Test Key. */
  canTest?: boolean;

  /** The status card above the form. Omit to hide it. */
  statusProps?: ApiStatusProps;
  /** The rent-key banner under the form. Omit to hide it. */
  rentBannerProps?: RentApiBannerProps | null;
  /** The guide card in the right column. Omit to hide it. */
  viewGuideProps?: ViewGuideProps | null;
  /** The numbered setup steps. */
  steps?: SetupStep[];
  /** The right column's heading. */
  sideTitle?: ReactNode;
  /** The line under it. */
  sideDescription?: ReactNode;

  /** Draws the whole screen as skeleton bars. */
  loading?: boolean;
  /** Hides the credential form — what the saved state draws. */
  hideForm?: boolean;

  /** Replaces the credential form. Call `defaultRender()` to decorate it. */
  renderForm?: RenderProp<ApiKeyFormRenderProps>;
  /** Replaces the right column. */
  renderSide?: RenderProp<ApiKeySideRenderProps>;
} & UpworkApiKeyStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, "className" | "style" | "title">;

/** The steps Figma draws when a caller passes none. */
const DEFAULT_STEPS: SetupStep[] = [
  {
    title: "Go to Upwork Settings",
    description: "Navigate to Developer Settings",
    highlighted: true,
  },
  { title: "Create API Key", description: "Generate new API credentials" },
  { title: "Copy Credentials", description: "Copy Client ID and Secret Key" },
  { title: "Paste Here", description: "Enter credentials in the form" },
];

/**
 * CRM ▸ Settings ▸ Upwork API Key — Figma node 2105:33765.
 *
 * The same two-column shell as the connected-accounts screen, and it reads
 * that screen's column and header tokens rather than restating them: a fixed
 * form column on the left, a tinted reference column on the right.
 *
 * Five states are drawn in Figma and all five are this one composition with
 * parts switched off. `loading` swaps every block for skeleton bars; the saved
 * state passes `hideForm`, leaving the status card and the guide; testing and
 * test-complete differ only in which `testTone` the strip reports. Modelling
 * them as five variants would have meant five copies of the same shell.
 */
export const UpworkApiKey = forwardRef<HTMLDivElement, UpworkApiKeyProps>(
  function UpworkApiKey(
    {
      show = "both",
      title = "Connect Upwork API",
      description = "Enter your Upwork API credentials",
      onBack,
      clientId,
      onClientIdChange,
      secretKey,
      onSecretKeyChange,
      testTone,
      testMessage,
      onTest,
      onSave,
      canSave = false,
      canTest = false,
      statusProps,
      rentBannerProps,
      viewGuideProps,
      steps = DEFAULT_STEPS,
      sideTitle = "Getting Started",
      sideDescription = "Quick information about Upwork API",
      loading = false,
      hideForm = false,
      formWidth,
      sectionGap,
      sideBackground,
      renderForm,
      renderSide,
      ...rest
    },
    ref
  ) {
    const isTesting = testTone === "testing";
    const showForm = show !== "side";
    const showSide = show !== "form";

    const rootStyle: CSSProperties = {
      display: "flex",
      alignItems: "stretch",
      boxSizing: "border-box",
      width: "100%",
      backgroundColor: color.main.white,
      fontFamily: typography.fontFamily.base,
    };

    const defaultForm = () => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: `${form.gap}px`,
        }}
      >
        <TextField
          label="Client ID"
          labelIcon={IconClientIdPeopleStroke}
          placeholder="Input Client ID"
          value={clientId}
          onChange={(event) => onClientIdChange?.(event.target.value)}
          disabled={isTesting}
        />

        <TextField
          label="Secret Key"
          labelIcon={IconSecretKeyShieldStroke}
          placeholder="Input Secret Key"
          secret
          value={secretKey}
          onChange={(event) => onSecretKeyChange?.(event.target.value)}
          disabled={isTesting}
        />

        {testTone && (
          <TestStatus tone={testTone}>{testMessage ?? undefined}</TestStatus>
        )}

        <div style={{ display: "flex", gap: `${form.actionGap}px` }}>
          {/* Both buttons stretch, so the row splits evenly however wide the
            column is drawn — Figma gives each half the form. */}
          <span style={{ display: "flex", flex: "1 1 0" }}>
            <Button
              variant="secondary"
              onClick={onTest}
              disabled={!canTest || isTesting}
              fullWidth
            >
              {isTesting ? "Test Key..." : "Test Key"}
            </Button>
          </span>
          <span style={{ display: "flex", flex: "1 1 0" }}>
            <Button
              variant="primary"
              onClick={onSave}
              disabled={!canSave || isTesting}
              fullWidth
            >
              Save Key
            </Button>
          </span>
        </div>
      </div>
    );

    const defaultSide = () => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: `${upworkAccounts.sideGap}px`,
        }}
      >
        {viewGuideProps !== null && <ViewGuide {...viewGuideProps} />}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: `${upworkAccounts.step.titleGap}px`,
          }}
        >
          <span
            style={{
              color: color.navbar.text2,
              fontSize: `${upworkApiKey.guideCard.titleFontSize}px`,
              fontWeight: typography.fontWeight.medium,
              letterSpacing: typography.letterSpacing.m,
              lineHeight: 1.4,
            }}
          >
            Quick Setup Steps
          </span>

          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: `${upworkAccounts.step.gap}px`,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  width: upworkAccounts.step.size,
                  height: upworkAccounts.step.size,
                  borderRadius: "50%",
                  backgroundColor: color.main.brand,
                  color: color.main.white,
                  fontSize: `${upworkAccounts.step.fontSize}px`,
                  fontWeight: typography.fontWeight.semibold,
                  lineHeight: 1,
                }}
              >
                {index + 1}
              </span>

              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    color: color.navbar.text2,
                    fontSize: `${upworkAccounts.step.labelFontSize}px`,
                    fontWeight: typography.fontWeight.medium,
                    letterSpacing: typography.letterSpacing.s,
                    lineHeight: 1.5,
                  }}
                >
                  {step.title}
                </span>
                <span
                  style={{
                    color: step.highlighted
                      ? color.main.brand
                      : color.main.description,
                    fontSize: `${upworkAccounts.step.labelFontSize}px`,
                    fontWeight: typography.fontWeight.regular,
                    letterSpacing: typography.letterSpacing.s,
                    lineHeight: 1.4,
                  }}
                >
                  {step.description}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div {...rest} ref={ref} style={rootStyle}>
        {/* Left — the credential form. */}
        {showForm && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              // A column drawn on its own takes the full width; beside the other
              // it holds the fixed measure Figma gives it.
              flexShrink: showSide ? 0 : 1,
              flexGrow: showSide ? 0 : 1,
              width: showSide
                ? len(formWidth) ?? `${upworkAccounts.listColumn.width}px`
                : "100%",
              maxWidth: "100%",
              borderRight: showSide
                ? `${borderWidth.thin}px solid ${color.main.backgroundAlt}`
                : undefined,
            }}
          >
            {loading ? (
              <SkeletonHeader />
            ) : (
              <SettingsHeader
                title={title}
                description={description}
                onBack={onBack}
              />
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                width: "100%",
                gap: len(sectionGap) ?? `${form.sectionGap}px`,
                padding: `0 ${upworkAccounts.header.paddingX}px ${upworkAccounts.header.paddingY}px`,
              }}
            >
              {loading ? (
                <SkeletonForm />
              ) : (
                <>
                  {statusProps && <ApiStatus {...statusProps} />}

                  {!hideForm &&
                    (renderForm
                      ? renderForm({ defaultRender: defaultForm })
                      : defaultForm())}

                  {!hideForm && rentBannerProps !== null && <OrDivider />}

                  {rentBannerProps !== null && (
                    <RentApiBanner {...rentBannerProps} />
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Right — the reference column. */}
        {showSide && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
              minWidth: 0,
              boxSizing: "border-box",
              backgroundColor:
                sideBackground ?? upworkAccounts.listColumn.background,
            }}
          >
            {loading ? (
              <SkeletonHeader />
            ) : (
              <SettingsHeader title={sideTitle} description={sideDescription} />
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                width: "100%",
                padding: `0 ${upworkAccounts.bodyPaddingX}px ${upworkAccounts.header.paddingY}px`,
              }}
            >
              {loading ? (
                <SkeletonSide />
              ) : renderSide ? (
                renderSide({ steps, defaultRender: defaultSide })
              ) : (
                defaultSide()
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

/**
 * The OR rule between the form and the rent banner.
 *
 * Two rules with a label between them rather than a bordered box: the label
 * sits in the gap in the line, which is what reads as "or" rather than as a
 * section heading.
 */
function OrDivider() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: `${form.dividerGap}px`,
      }}
    >
      <span
        style={{
          flex: "1 1 0",
          height: 1,
          backgroundColor: color.main.backgroundAlt,
        }}
      />
      <span
        style={{
          color: color.navbar.border,
          fontSize: `${form.dividerFontSize}px`,
          fontWeight: typography.fontWeight.regular,
          letterSpacing: typography.letterSpacing.m,
          lineHeight: 1,
        }}
      >
        OR
      </span>
      <span
        style={{
          flex: "1 1 0",
          height: 1,
          backgroundColor: color.main.backgroundAlt,
        }}
      />
    </div>
  );
}

function SkeletonHeader() {
  const { header } = upworkAccounts;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        width: "100%",
        gap: header.titleGap,
        padding: `${header.paddingY}px ${header.paddingX}px`,
      }}
    >
      <Skeleton width={139} height={19} />
      <Skeleton variant="text" width="100%" />
    </div>
  );
}

function SkeletonForm() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${form.sectionGap}px`,
      }}
    >
      <Skeleton height={164} radius={16} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${form.gap}px`,
        }}
      >
        <Skeleton width={102} height={20} />
        <Skeleton
          height={upworkApiKey.field.height}
          radius={upworkApiKey.field.radius}
        />
        <Skeleton width={100} height={20} />
        <Skeleton
          height={upworkApiKey.field.height}
          radius={upworkApiKey.field.radius}
        />
      </div>
      <div style={{ display: "flex", gap: `${form.actionGap}px` }}>
        <span style={{ flex: "1 1 0" }}>
          <Skeleton height={33} radius={upworkApiKey.field.radius} />
        </span>
        <span style={{ flex: "1 1 0" }}>
          <Skeleton height={33} radius={upworkApiKey.field.radius} />
        </span>
      </div>
      <Skeleton height={64} radius={16} />
    </div>
  );
}

function SkeletonSide() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${upworkAccounts.sideGap}px`,
      }}
    >
      <Skeleton height={99} radius={upworkApiKey.status.radius} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: `${upworkAccounts.step.rowGap}px`,
        }}
      >
        <Skeleton width={108} height={17} />
        {[0, 1, 2, 3].map((row) => (
          <Skeleton
            key={row}
            height={34.5}
            radius={upworkApiKey.field.radius}
          />
        ))}
      </div>
    </div>
  );
}
