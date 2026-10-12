export type BlueprintRendererView = '3d-top';

export interface BlueprintMetric {
  labelKey: string;
  valueKey: string;
}

export interface BlueprintRendererOptions {
  showBase: boolean;
  view: BlueprintRendererView;
  animations: boolean;
  autoplay: boolean;
}

/** Each blueprint entry maps to one JSON document consumed by the renderer. */
export interface BlueprintEntry {
  id: string;
  titleKey: string;
  descriptionKey: string;
  jsonPath: string;
  version: string;
  gameVersion: string;
  status: 'ready' | 'pending';
  updatedAt: string;
  tagKeys: string[];
  metrics: BlueprintMetric[];
  renderer: BlueprintRendererOptions;
}

export interface BlueprintCollection {
  id: string;
  nameKey: string;
  descriptionKey: string;
  purposeKey: string;
  icon: string;
  accent: string;
  blueprints: BlueprintEntry[];
}

export const blueprintCollections: BlueprintCollection[] = [
  {
    id: 'core-production',
    nameKey: 'page.blueprint.resourceLibrary.collections.coreProduction.title',
    descriptionKey: 'page.blueprint.resourceLibrary.collections.coreProduction.description',
    purposeKey: 'page.blueprint.resourceLibrary.collections.coreProduction.purpose',
    icon: 'mdi-factory',
    accent: '#00c896',
    blueprints: [
      {
        id: 'quality-bud-needle-6-min',
        titleKey: 'page.blueprint.resourceLibrary.blueprints.qualityBudNeedle6Min.title',
        descriptionKey:
          'page.blueprint.resourceLibrary.blueprints.qualityBudNeedle6Min.description',
        jsonPath: '/blueprints/quality-bud-needle-6-min.json',
        version: 'test',
        gameVersion: 'N/A',
        status: 'ready',
        updatedAt: '2026-10-13',
        tagKeys: [
          'page.blueprint.resourceLibrary.tags.qualityBudNeedle',
          'page.blueprint.resourceLibrary.tags.sixPerMinute',
          'page.blueprint.resourceLibrary.tags.externalPower',
        ],
        metrics: [
          {
            labelKey: 'page.blueprint.resourceLibrary.metadata.dimensions',
            valueKey:
              'page.blueprint.resourceLibrary.blueprints.qualityBudNeedle6Min.metrics.dimensions',
          },
          {
            labelKey: 'page.blueprint.resourceLibrary.metadata.entityCount',
            valueKey:
              'page.blueprint.resourceLibrary.blueprints.qualityBudNeedle6Min.metrics.entityCount',
          },
          {
            labelKey: 'page.blueprint.resourceLibrary.metadata.slotLinks',
            valueKey:
              'page.blueprint.resourceLibrary.blueprints.qualityBudNeedle6Min.metrics.slotLinks',
          },
        ],
        renderer: {
          showBase: false,
          view: '3d-top',
          animations: false,
          autoplay: false,
        },
      },
    ],
  },
  {
    id: 'starter-layouts',
    nameKey: 'page.blueprint.resourceLibrary.collections.starterLayouts.title',
    descriptionKey: 'page.blueprint.resourceLibrary.collections.starterLayouts.description',
    purposeKey: 'page.blueprint.resourceLibrary.collections.starterLayouts.purpose',
    icon: 'mdi-seed-outline',
    accent: '#ffb547',
    blueprints: [],
  },
  {
    id: 'community-lab',
    nameKey: 'page.blueprint.resourceLibrary.collections.communityLab.title',
    descriptionKey: 'page.blueprint.resourceLibrary.collections.communityLab.description',
    purposeKey: 'page.blueprint.resourceLibrary.collections.communityLab.purpose',
    icon: 'mdi-flask-outline',
    accent: '#7198ff',
    blueprints: [],
  },
];
