<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { tryit } from 'radashi'
import AppButton from '@/components/ui/AppButton.vue'
import AppTag from '@/components/ui/AppTag.vue'
import avatarImg from '@/assets/aaron_img.jpg'
import { skillService } from '@/services/skillService'

const { t } = useI18n()

const heroTags = ref<string[]>([])

onMounted(async () => {
  const [err, result] = await tryit(skillService.getHeroSkillNames)()
  if (err) {
    console.error('Failed to load hero tags:', err)
    return
  }
  heroTags.value = result
})

const CODE_SNIPPETS = [
  'public class Startup\n{\n  public void ConfigureServices(IServiceCollection s)\n  {\n    s.AddControllers();\n    s.AddSwaggerGen();\n  }\n}',
  '[ApiController]\n[Route("api/[controller]")]\npublic class UsersController : ControllerBase\n{\n  private readonly IUserService _svc;\n\n  [HttpGet("{id}")]\n  public async Task GetById(int id)\n    =\x3e Ok(await _svc.GetByIdAsync(id));\n}',
  'builder.Services\n  .AddAuthentication(JwtBearerDefaults.Scheme)\n  .AddJwtBearer(opt =\x3e\n  {\n    opt.TokenValidationParameters = new()\n    {\n      ValidateIssuer = true,\n      ValidateAudience = true\n    };\n  });',
  'const router = createRouter({\n  history: createWebHistory(),\n  routes: [\n    { path: "/", component: Home },\n    { path: "/about", component: About },\n  ],\n})',
  'public interface IRepository\n{\n  Task GetByIdAsync(int id);\n  Task GetAllAsync();\n  Task AddAsync(T entity);\n  Task UpdateAsync(T entity);\n  Task DeleteAsync(int id);\n}',
  'app.MapGet("/api/health", () =\x3e\n  Results.Ok(new { Status = "Healthy" }));\n\napp.MapPost("/api/items", async\n  (Item item, AppDbContext db) =\x3e\n{\n  db.Items.Add(item);\n  await db.SaveChangesAsync();\n  return Results.Created();\n});',
  'import { ref, computed } from "vue"\n\nconst count = ref(0)\nconst doubled = computed(\n  () =\x3e count.value * 2\n)\n\nfunction increment() {\n  count.value++\n}',
  'services.AddDbContext(opt =\x3e\n  opt.UseNpgsql(\n    config.GetConnectionString("Default")\n  ));\n\nservices.AddScoped();',
  'export function useAuth() {\n  const user = ref(null)\n  const isAuthenticated = computed(\n    () =\x3e !!user.value\n  )\n\n  async function login(cred: Login) {\n    const { data } = await api.post(\n      "/auth", cred\n    )\n    user.value = data.user\n  }\n\n  return { user, isAuthenticated, login }\n}',
  'public record CreateOrderCommand(\n  int CustomerId,\n  List Items\n) : IRequest;\n\npublic class CreateOrderHandler\n  : IRequestHandler\n{\n  public async Task Handle(\n    CreateOrderCommand cmd,\n    CancellationToken ct)\n  {\n    var order = Order.Create(cmd.CustomerId);\n    return new OrderResult(order.Id);\n  }\n}',
  '.fade-enter-active,\n.fade-leave-active {\n  transition: opacity 0.3s ease;\n}\n.fade-enter-from,\n.fade-leave-to {\n  opacity: 0;\n}',
  'const { data, error } = await supabase\n  .from("projects")\n  .select("*")\n  .eq("enabled", true)\n  .order("sort_order", { ascending: true })',
]

const sectionRef = ref<HTMLElement | null>(null)
const contentLayerRef = ref<HTMLElement | null>(null)

const targetX = ref(-9999)
const targetY = ref(-9999)
const currentX = ref(-9999)
const currentY = ref(-9999)
const spotlightActive = ref(false)
const spotlightOpacity = ref(0)
let rafId = 0

const SPOTLIGHT_RADIUS = 280
const LERP_SPEED = 0.12

function onMouseMove(e: MouseEvent) {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  targetX.value = e.clientX - rect.left
  targetY.value = e.clientY - rect.top
  if (!spotlightActive.value) {
    currentX.value = targetX.value
    currentY.value = targetY.value
    spotlightActive.value = true
  }
}

function onMouseLeave() {
  spotlightActive.value = false
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function tick() {
  currentX.value = lerp(currentX.value, targetX.value, LERP_SPEED)
  currentY.value = lerp(currentY.value, targetY.value, LERP_SPEED)

  const fadeTarget = spotlightActive.value ? 1 : 0
  spotlightOpacity.value = lerp(spotlightOpacity.value, fadeTarget, 0.08)

  if (contentLayerRef.value) {
    if (spotlightOpacity.value > 0.01) {
      const x = currentX.value
      const y = currentY.value
      const r = SPOTLIGHT_RADIUS * spotlightOpacity.value
      const mask = `radial-gradient(circle ${r}px at ${x}px ${y}px, transparent 0%, rgba(0,0,0,0.02) 25%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.5) 65%, rgba(0,0,0,0.85) 80%, black 100%)`
      contentLayerRef.value.style.maskImage = mask
      contentLayerRef.value.style.webkitMaskImage = mask
    } else {
      contentLayerRef.value.style.maskImage = ''
      contentLayerRef.value.style.webkitMaskImage = ''
    }
  }

  rafId = requestAnimationFrame(tick)
}

interface CodeBlock {
  text: string
  top: string
  left: string
  rotate: string
  opacity: number
  fontSize: string
}

const codeBlocks = ref<CodeBlock[]>([])

function generateCodeBlocks() {
  const blocks: CodeBlock[] = []
  const cols = 4
  const rows = 5
  const cellW = 100 / cols
  const cellH = 100 / rows

  let snippetIdx = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jitterX = (Math.random() - 0.5) * cellW * 0.5
      const jitterY = (Math.random() - 0.5) * cellH * 0.4
      blocks.push({
        text: CODE_SNIPPETS[snippetIdx % CODE_SNIPPETS.length],
        top: `${r * cellH + cellH / 2 + jitterY}%`,
        left: `${c * cellW + cellW / 2 + jitterX}%`,
        rotate: `${(Math.random() - 0.5) * 12}deg`,
        opacity: 0.25 + Math.random() * 0.2,
        fontSize: `${0.55 + Math.random() * 0.2}rem`,
      })
      snippetIdx++
    }
  }
  codeBlocks.value = blocks
}

onMounted(() => {
  generateCodeBlocks()
  sectionRef.value?.addEventListener('mousemove', onMouseMove, { passive: true })
  sectionRef.value?.addEventListener('mouseleave', onMouseLeave)
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  sectionRef.value?.removeEventListener('mousemove', onMouseMove)
  sectionRef.value?.removeEventListener('mouseleave', onMouseLeave)
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <section
    id="home"
    ref="sectionRef"
    :aria-label="t('nav-home')"
    class="hero-section relative flex min-h-screen items-center justify-center overflow-hidden"
  >
    <div class="absolute inset-0 z-0 bg-[#0d1117] dark:bg-black" aria-hidden="true">
      <div
        v-for="(block, i) in codeBlocks"
        :key="i"
        class="code-block pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-pre font-mono leading-snug select-none text-[rgba(0,140,255,0.5)] dark:text-[rgba(0,255,120,0.7)]"
        :style="{
          top: block.top,
          left: block.left,
          transform: `translate(-50%, -50%) rotate(${block.rotate})`,
          opacity: block.opacity,
          fontSize: block.fontSize,
        }"
      >{{ block.text }}</div>
    </div>

    <div
      ref="contentLayerRef"
      class="hero-content-layer pointer-events-none absolute inset-0 z-10"
    >
      <div class="absolute inset-0 bg-background" />

      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30"
      />
    </div>

    <div class="relative z-20 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
      <div class="mb-6 flex justify-center">
        <img
          :src="avatarImg"
          :alt="t('hero-avatar-alt')"
          width="112"
          height="112"
          class="h-28 w-28 rounded-full object-cover border-4 border-border shadow-lg animate-float"
        />
      </div>

      <p class="mb-4 text-sm font-medium tracking-widest uppercase text-muted-foreground">
        {{ t('hero-greeting') }}
      </p>

      <h1 class="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
        {{ t('hero-name') }}
      </h1>

      <p class="mt-4 text-xl text-muted-foreground sm:text-2xl">
        {{ t('hero-title') }}
      </p>

      <p class="mt-6 max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
        {{ t('hero-description') }}<br class="hidden sm:block" />
        {{ t('hero-description-line2') }}
      </p>

      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <AppButton size="lg" href="#projects">
          {{ t('hero-view-projects') }}
        </AppButton>
        <AppButton variant="ghost" size="lg" href="#contact">
          {{ t('hero-contact') }}
        </AppButton>
      </div>

      <div class="mt-12 flex flex-wrap items-center justify-center gap-2">
        <AppTag v-for="tag in heroTags" :key="tag" variant="outline">
          {{ tag }}
        </AppTag>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.hero-content-layer {
  will-change: mask-image, -webkit-mask-image;
}

.code-block {
  max-width: 340px;
  line-height: 1.4;
}
</style>
