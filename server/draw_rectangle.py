import inkex
from inkex import Rectangle

class DrawRectangle(inkex.EffectExtension):
    def add_arguments(self, pars):
        pars.add_argument("--width", type=float, default=100.0, help="Width of the rectangle")
        pars.add_argument("--height", type=float, default=50.0, help="Height of the rectangle")
        pars.add_argument("--color", type=str, default="#ff0000", help="Color of the rectangle")

    def effect(self):
        # Create a new rectangle element
        rect = Rectangle(x=10, y=10, width=self.options.width, height=self.options.height)
        
        # Set the style of the rectangle (fill color)
        rect.style = {
            'stroke': 'none',
            'fill': self.options.color
        }
        
        # Add the rectangle to the current layer
        self.svg.get_current_layer().add(rect)

if __name__ == '__main__':
    DrawRectangle().run()
