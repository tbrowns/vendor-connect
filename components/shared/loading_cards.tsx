import { Card, CardContent } from "@/components/ui/card";

export const SkeletonProductCard = ({ length }: { length: number }) => {
  return Array.from({ length: length }).map((_, index) => (
    <Card
      key={index}
      className="bg-card rounded-lg shadow-md p-2 animate-pulse w-60"
    >
      <div className="aspect-square relative bg-muted-foreground/20 rounded-lg" />
      <CardContent>
        <div className="h-6 w-3/4 bg-muted-foreground/20 rounded mt-3" />
        <div className="h-4 w-full bg-muted-foreground/20 rounded mt-2" />
        <div className="h-8 w-1/2 bg-muted-foreground/20 rounded mt-3" />
      </CardContent>
    </Card>
  ));
};
