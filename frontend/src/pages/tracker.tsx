import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Kanban, List, Building2, MapPin, Calendar, Sparkles } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PageHeader } from '@/components/page-header';
import { GradientText } from '@/components/gradient-text';
import { MatchRing } from '@/components/match-ring';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useUserStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { Application, Job, KanbanColumn } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

const columns: { id: KanbanColumn; title: string; color: string }[] = [
  { id: 'saved', title: 'Saved', color: 'bg-zinc-500' },
  { id: 'applied', title: 'Applied', color: 'bg-blue-500' },
  { id: 'interview', title: 'Interview', color: 'bg-purple-500' },
  { id: 'offer', title: 'Offer', color: 'bg-emerald-500' },
];

export default function Tracker() {
  const { user } = useUserStore();
  const [viewMode, setViewMode] = useState<'kanban' | 'timeline'>('kanban');
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['/api/applications', { userId: user?.id || 'demo' }],
  });

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: KanbanColumn }) => {
      const res = await apiRequest('PATCH', `/api/applications/${id}`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update application', variant: 'destructive' });
    },
  });

  const getJobForApplication = (app: Application) => {
    return jobs.find(j => j.id === app.jobId);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as KanbanColumn;
    
    updateApplicationMutation.mutate({ id: draggableId, status: newStatus });

    if (newStatus === 'offer') {
      setShowConfetti(true);
      toast({
        title: 'Congratulations!',
        description: 'You received an offer! Keep up the great work!',
      });
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const getColumnApplications = (columnId: KanbanColumn) =>
    applications.filter(app => app.status === columnId);

  return (
    <div className="flex-1 overflow-hidden flex flex-col" data-testid="page-tracker">
      <PageHeader title="Application Tracker" />

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3"
              data-testid="modal-confetti"
            >
              <Sparkles className="w-6 h-6" />
              <span className="text-xl font-bold">Offer Received!</span>
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground" data-testid="text-applications-count">
            {applications.length} applications tracked
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
            data-testid="button-view-kanban"
          >
            <Kanban className="w-4 h-4 mr-1" />
            Kanban
          </Button>
          <Button
            variant={viewMode === 'timeline' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('timeline')}
            data-testid="button-view-timeline"
          >
            <List className="w-4 h-4 mr-1" />
            Timeline
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      ) : viewMode === 'kanban' ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto p-4" data-testid="kanban-board">
            <div className="flex gap-4 min-w-max h-full">
              {columns.map((column) => (
                <div key={column.id} className="w-72 flex flex-col" data-testid={`column-${column.id}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn('w-3 h-3 rounded-full', column.color)} />
                    <h3 className="font-semibold">{column.title}</h3>
                    <Badge variant="secondary" className="ml-auto" data-testid={`badge-count-${column.id}`}>
                      {getColumnApplications(column.id).length}
                    </Badge>
                  </div>

                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          'flex-1 rounded-lg p-2 transition-colors min-h-[200px]',
                          snapshot.isDraggingOver
                            ? 'bg-muted/80 border-2 border-dashed border-primary/50'
                            : 'bg-muted/40'
                        )}
                      >
                        <ScrollArea className="h-full">
                          <div className="space-y-2">
                            {getColumnApplications(column.id).map((app, index) => {
                              const job = getJobForApplication(app);
                              return (
                                <Draggable key={app.id} draggableId={app.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      data-testid={`application-card-${app.id}`}
                                    >
                                      <Card
                                        className={cn(
                                          'cursor-grab active:cursor-grabbing transition-shadow',
                                          snapshot.isDragging && 'shadow-lg ring-2 ring-primary'
                                        )}
                                      >
                                        <CardContent className="p-3">
                                          <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                              <h4 className="font-medium text-sm truncate" data-testid={`text-app-title-${app.id}`}>
                                                {job?.title || 'Unknown Position'}
                                              </h4>
                                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <Building2 className="w-3 h-3" />
                                                <span className="truncate" data-testid={`text-app-company-${app.id}`}>{job?.company || 'Unknown'}</span>
                                              </div>
                                            </div>
                                            <MatchRing score={job?.matchScore || 0} size="sm" showLabel={false} />
                                          </div>

                                          {job?.location && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                              <MapPin className="w-3 h-3" />
                                              <span className="truncate">{job.location}</span>
                                            </div>
                                          )}

                                          {app.appliedAt && (
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground" data-testid={`text-app-date-${app.id}`}>
                                              <Calendar className="w-3 h-3" />
                                              <span>Applied {app.appliedAt}</span>
                                            </div>
                                          )}

                                          {app.notes && (
                                            <p className="text-xs text-muted-foreground mt-2 italic" data-testid={`text-app-notes-${app.id}`}>
                                              {app.notes}
                                            </p>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </div>
                                  )}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </div>
        </DragDropContext>
      ) : (
        <ScrollArea className="flex-1" data-testid="timeline-view">
          <div className="p-4 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {applications
                  .sort((a, b) => (b.appliedAt || '').localeCompare(a.appliedAt || ''))
                  .map((app, index) => {
                    const column = columns.find(c => c.id === app.status);
                    const job = getJobForApplication(app);
                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative pl-10"
                        data-testid={`timeline-item-${app.id}`}
                      >
                        <div className={cn(
                          'absolute left-2.5 w-3 h-3 rounded-full',
                          column?.color || 'bg-zinc-500'
                        )} />
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="secondary" className="text-xs">
                                    {column?.title}
                                  </Badge>
                                  {app.appliedAt && (
                                    <span className="text-xs text-muted-foreground">
                                      {app.appliedAt}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-medium">{job?.title}</h4>
                                <p className="text-sm text-muted-foreground">{job?.company}</p>
                                {app.notes && (
                                  <p className="text-sm text-muted-foreground mt-2 italic">
                                    {app.notes}
                                  </p>
                                )}
                              </div>
                              <MatchRing score={job?.matchScore || 0} size="sm" />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
