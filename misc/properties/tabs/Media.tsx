import { Card } from '@/components/ui/card'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageIcon, X } from 'lucide-react'
import React from 'react'
import placeholderImg from "@/assets/property-2.jpg";

function Media({p, upd}: {p: any, upd: any}) {

  return (
                  <Card className="rounded-2xl p-5 shadow-card border-0 space-y-4">
                <div>
                  <Label className="mb-2 block">Image Gallery</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {p.images.map((img: any, i: number) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-video">
                        <img src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
                        <button
                          onClick={() => upd("images", p.images.filter((_: any, idx: number) => idx !== i))}
                          className="absolute top-2 right-2 rounded-full bg-card/90 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => upd("images", [...p.images, placeholderImg.src])}
                      className="rounded-xl border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <ImageIcon className="h-5 w-5 mb-1" />
                      <span className="text-xs">Add image</span>
                    </button>
                  </div>
                </div>
                <Field label="Video Tour URL">
                  <Input value={p.videoTourUrl || ""} onChange={(e) => upd("videoTourUrl", e.target.value)} className="rounded-xl" placeholder="https://youtube.com/..." />
                </Field>
              </Card>
  )
}

export default Media