export default function Loading() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header with shimmer effect */}
      <div className="p-4 border-b">
        <div className="h-6 w-48 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer rounded-md" />
      </div>

      {/* Chat messages with staggered animation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* AI message */}
        <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-primary/10 rounded animate-pulse" />
            <div className="space-y-1">
              <div className="h-4 w-[80%] bg-primary/10 rounded animate-pulse" />
              <div className="h-4 w-[60%] bg-primary/10 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* User message */}
        <div className="flex items-start gap-3 justify-end animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-primary/10 rounded animate-pulse ml-auto" />
            <div className="space-y-1">
              <div className="h-4 w-[70%] bg-primary/10 rounded animate-pulse ml-auto" />
              <div className="h-4 w-[40%] bg-primary/10 rounded animate-pulse ml-auto" />
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse" />
        </div>

        {/* Typing indicator */}
        <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse" />
          <div className="flex gap-1 p-2 bg-muted rounded-lg">
            <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="h-2 w-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="h-10 w-full bg-muted rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
