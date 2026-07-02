<script lang="ts">
  import * as Card from "$lib/components/ui/card";

  let isDragging = $state(false);
  let { files = $bindable<File[]>([]) } = $props();

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;

    if (e.dataTransfer?.files) {
      files = [...files, ...Array.from(e.dataTransfer.files)];
      // Process files here
      console.log(files);
    }
  }

  function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      files = [...files, ...Array.from(target.files)];
    }
  }
</script>

<Card.Root
  class="relative flex flex-col items-center justify-center p-12 border-2 border-dashed transition-colors
	{isDragging
    ? 'border-primary bg-muted/50'
    : 'border-muted-foreground/20 bg-background'}"
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  <input
    type="file"
    id="file-upload"
    class="hidden"
    multiple
    onchange={handleFileSelect}
  />

  <label
    for="file-upload"
    class="flex flex-col items-center justify-center gap-4 cursor-pointer w-full h-full text-center"
  >
    <div class="space-y-1">
      <p class="font-medium text-sm">Drag and drop your files here</p>
      <p class="text-xs text-muted-foreground">
        or click to browse from your computer
      </p>
    </div>
  </label>
</Card.Root>

{#if files.length > 0}
  <ul class="mt-4 space-y-2">
    {#each files as file}
      <li class="text-xs text-muted-foreground p-2 bg-muted rounded">
        {file.name} ({(file.size / 1024).toFixed(1)} KB)
      </li>
    {/each}
  </ul>
{/if}
