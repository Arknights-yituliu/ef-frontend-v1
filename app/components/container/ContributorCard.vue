<script setup lang="ts">
type LocalizedInfo = {
  position: string
  tags: string[]
}

type Contributor = {
  name: string
  avatarImg: string
  link?: string
  english: LocalizedInfo
  chinese: LocalizedInfo
}

const contributorAssets = import.meta.glob('~/assets/avatar/contributors/*', {
  eager: true,
  import: 'default'
}) as Record<string, string>

const props = defineProps<{
  contributor: Contributor
}>()

const {t, locale} = useI18n()

const localizedInfo = computed<LocalizedInfo>(() => {
  if (locale.value === 'en-US') {
    return props.contributor.english
  }
  return props.contributor.chinese
})

const resolvedAvatar = computed(() => {
  const source = props.contributor.avatarImg

  if (/^https?:\/\//i.test(source)) {
    return source
  }

  const targetFileName = source.split('/').pop()

  if (targetFileName) {
    const matchedEntry = Object.entries(contributorAssets).find(([key]) => key.endsWith(targetFileName))

    if (matchedEntry) {
      return matchedEntry[1]
    }
  }

})

const tags = computed(() => localizedInfo.value.tags ?? [])

const cardElement = ref<HTMLElement | null>(null)
const tiltWrapper = ref<HTMLElement | null>(null)
const innerElement = ref<HTMLElement | null>(null)
const mediaElement = ref<HTMLElement | null>(null)

let cardRect: DOMRect | null = null
let animationFrameId: number | null = null
let targetPercentX = 0
let targetPercentY = 0

function handleMouseEnter() {
  updateCardRect()
  setHoverState(true)
}

function handleMouseMove(event: MouseEvent) {
  if (!cardRect) {
    updateCardRect()
  }

  if (!cardRect) {
    return
  }

  const {left, top, width, height} = cardRect
  const relativeX = event.clientX - left
  const relativeY = event.clientY - top

  targetPercentX = clamp(relativeX / width - 0.5, -0.5, 0.5)
  targetPercentY = clamp(relativeY / height - 0.5, -0.5, 0.5)

  requestTransformUpdate()
}

function handleMouseLeave() {
  targetPercentX = 0
  targetPercentY = 0
  requestTransformUpdate(() => {
    setHoverState(false)
  })
}

function requestTransformUpdate(onComplete?: () => void) {
  if (animationFrameId != null) {
    cancelAnimationFrame(animationFrameId)
  }

  animationFrameId = requestAnimationFrame(() => {
    applyTransform(targetPercentX, targetPercentY)
    animationFrameId = null
    if (onComplete) {
      onComplete()
    }
  })
}

function applyTransform(percentX: number, percentY: number) {
  const rotateMax = 12
  const offsetScale = 28

  const rotateX = -percentY * rotateMax * 2
  const rotateY = percentX * rotateMax * 2
  const offsetX = percentX * offsetScale
  const offsetY = percentY * offsetScale

  if (tiltWrapper.value) {
    tiltWrapper.value.style.transform = `translateZ(0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    tiltWrapper.value.style.transition = percentX === 0 && percentY === 0 ? 'transform var(--transition-base)' : 'transform 80ms ease-out'
  }

  if (mediaElement.value) {
    mediaElement.value.style.transform = `translate3d(${offsetX * 0.6}px, ${offsetY * 0.6}px, 60px)`
  }

  if (innerElement.value) {
    innerElement.value.style.transform = `translate3d(${offsetX * 0.35}px, ${offsetY * 0.35}px, 35px)`
  }

}

function updateCardRect() {
  if (!cardElement.value) {
    cardRect = null
    return
  }

  cardRect = cardElement.value.getBoundingClientRect()
}

function setHoverState(active: boolean) {
  if (tiltWrapper.value) {
    tiltWrapper.value.classList.toggle('is-hovered', active)
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

onMounted(() => {
  window.addEventListener('resize', updateCardRect)
  window.addEventListener('scroll', updateCardRect, true)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCardRect)
  window.removeEventListener('scroll', updateCardRect, true)
  if (animationFrameId != null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
})

</script>

<template>
  <article
    ref="cardElement"
    class="contributor-card"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <div ref="tiltWrapper" class="card__tilt">
      <div ref="innerElement" class="card__inner">
        <div ref="mediaElement" class="card__media">
          <span class="card__media-backdrop stripe-pattern" aria-hidden="true" />
          <img
            class="card__avatar"
            :src="resolvedAvatar"
            :alt="t('component.contributorCard.avatarAlt', { name: contributor.name })"
            loading="lazy"
          >
        </div>
        <div class="card__content">
          <div class="card__meta">
            <a
              v-if="contributor.link"
              :href="contributor.link"
              class="card__profile-link"
              target="_blank"
              rel="noopener"
            >
              <span>{{ t('component.contributorCard.profileLink') }}</span>
              <span aria-hidden="true" class="card__profile-icon">↗</span>
            </a>
          </div>
          <h3 class="card__name">
            {{ contributor.name }}
          </h3>
          <p class="card__position">
            {{ localizedInfo.position }}
          </p>
          <div class="card__divider" aria-hidden="true" />
          <div class="card__tags-wrap" v-if="tags.length">
            <span class="card__tags-label">
              {{ t('component.contributorCard.tagsLabel') }}
            </span>
            <ul class="card__tags">
              <li
                v-for="tag in tags"
                :key="`${contributor.name}-${tag}`"
                class="card__tag"
              >
                {{ tag }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.contributor-card {
  position: relative;
  width: 100%;
  flex: 1 1 320px;
  max-width: 360px;
  border-radius: var(--radius-md);
  border: 1px solid var(--theme-border);
  background: linear-gradient(135deg, var(--theme-bg-secondary), var(--theme-bg-tertiary));
  overflow: hidden;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  box-shadow: 0 0.75rem 1.5rem var(--theme-shadow-accent);
  isolation: isolate;
  perspective: 1200px;
}

.contributor-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, var(--theme-decorative-overlay-medium), transparent 65%);
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.85;
}

.card__tilt {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform var(--transition-base);
  will-change: transform;
}

.card__tilt.is-hovered {
  transition: transform 80ms ease-out;
  filter: drop-shadow(0 1.25rem 2.75rem var(--theme-shadow-accent-hover));
}

.card__inner {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  z-index: 2;
  transform-style: preserve-3d;
  transition: transform 120ms ease-out;
  will-change: transform;
}

.card__media {
  position: relative;
  width: 6.75rem;
  height: 6.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
  transition: transform 120ms ease-out;
  will-change: transform;
}

.card__media-backdrop {
  position: absolute;
  inset: 0;
  border-radius: 35%;
  background-color: var(--theme-decorative-overlay-light);
  filter: drop-shadow(0 0 0.75rem var(--theme-shadow-base));
  transform: rotate(-4deg);
  opacity: 0.45;
}

.card__avatar {
  position: relative;
  width: 5.75rem;
  height: 5.75rem;
  border-radius: 22%;
  object-fit: cover;
  border: 2px solid var(--theme-border-active);
  box-shadow: 0 0 1.5rem var(--theme-shadow-accent);
  z-index: 2;
  transition: transform var(--transition-base);
}

.card__tilt.is-hovered .card__avatar {
  transform: translateZ(80px);
}

.card__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  justify-content: center;
  transition: transform 160ms ease-out;
  will-change: transform;
}

.card__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.card__profile-link {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--theme-border);
  color: var(--theme-text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color var(--transition-fast), color var(--transition-fast), border-color var(--transition-fast);
}

.card__profile-link:hover {
  background: var(--theme-decorative-overlay-medium);
  color: var(--theme-text-primary);
  border-color: var(--theme-border-active);
}

.card__profile-icon {
  font-size: 1rem;
  line-height: 1;
  transform: translateY(-1px);
}

.card__name {
  font-size: clamp(1.375rem, 1.5vw + 0.75rem, 1.75rem);
  font-weight: 700;
  color: var(--theme-text-primary);
  letter-spacing: 0.04em;
}

.card__position {
  font-size: 1rem;
  color: var(--theme-text-secondary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card__divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--theme-border-active), transparent);
  margin: var(--spacing-sm) 0;
}

.card__tags-wrap {
  display: grid;
  gap: var(--spacing-sm);
}

.card__tags-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--theme-text-secondary);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  list-style: none;
  margin: 0;
  padding: 0;
}

.card__tag {
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--theme-border);
  background: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
}

@media (max-width: 640px) {
  .card__inner {
    flex-direction: column;
    text-align: center;
    padding: var(--spacing-md);
  }

  .card__media {
    margin: 0 auto;
  }

  .card__meta {
    justify-content: center;
    flex-wrap: wrap;
  }

  .card__profile-link {
    justify-content: center;
  }

  .card__divider {
    margin: var(--spacing-md) auto;
  }

  .card__tags {
    justify-content: center;
  }
}
</style>